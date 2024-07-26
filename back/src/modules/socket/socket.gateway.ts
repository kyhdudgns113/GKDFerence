import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets'
import {Server, Socket} from 'socket.io'
import {Logger} from '@nestjs/common'
import {
  gkdJwtSignOption,
  JwtPayload,
  SocketChatConnectedType,
  SocketChatContentType,
  SocketSetUnreadChatType,
  SocketTestCountType,
  SocketUserConnectedType
} from 'src/common'
import {JwtService} from '@nestjs/jwt'
import {UseDBService} from '../useDB/useDB.service'
import {LockService} from '../lock/lock.service'
import {GkdJwtService} from '../gkdJwt/gkdJwt.service'

/**
 * // NOTE: 클라이언트가 소켓을 전송하기 전에 refreshToken 을 호출한다.
 * // NOTE: 하지만 해당 소켓을 올바른 유저가 보냈는지 확인해야 한다.
 * // NOTE: 따라서 jwtService 를 사용한다.
 */
@WebSocketGateway({cors: true}) // Enable CORS if needed
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server
  private logger: Logger = new Logger('SocketGateway')

  private sockInfo: {
    [sockId: string]: {
      type: 'P' | 'Chat'
      uOId: string
    }
  } = {}
  private uOidInfo: {
    [uOId: string]: {
      numConnectedP: number
      connectedP: {[sockPid: string]: boolean}
    }
  } = {}
  private sockPidInfo: {
    [sockPid: string]: {
      uOId: string
      sockChatId: string
      cOId: string
    } | null
  } = {}
  private sockCidInfo: {
    [sockCid: string]: {
      uOId: string
      sockPid: string
      cOId: string
    }
  } = {}

  constructor(
    private gkdJwtService: GkdJwtService,
    private lockService: LockService,
    private useDBService: UseDBService
  ) {}

  afterInit(server: Server) {
    this.logger.log('Init')
    server.sockets.sockets.forEach(socket => {
      this.logger.log(`Disconnect prev socket : ${socket.id}`)
      socket.emit('user disconnect', 'disconnect')
    })
  }

  handleConnection(client: Socket, ...args: any[]) {
    // this.logger.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    // this.logger.log(`Client disconnected: ${client.id}`)

    const sid = client.id

    // NOTE: If server is reset, this.~~ is also reset.
    // NOTE: So we need to check if it was validate
    if (this.sockInfo[sid]) {
      switch (this.sockInfo[sid].type) {
        case 'P':
          {
            const uOid = this.sockInfo[sid].uOId
            const sockCId = this.sockPidInfo[sid].sockChatId
            delete this.sockPidInfo[sid]

            this.uOidInfo[uOid].numConnectedP -= 1
            delete this.uOidInfo[uOid].connectedP[sid]
            if (this.uOidInfo[uOid].numConnectedP === 0) {
              delete this.uOidInfo[uOid]
            }
            delete this.sockCidInfo[sockCId]
          }
          break
        case 'Chat':
          {
            const cOId = this.sockCidInfo[sid].cOId
            const pid = this.sockCidInfo[sid].sockPid

            this.sockPidInfo[pid].sockChatId = ''
            this.sockPidInfo[pid].cOId = ''

            delete this.sockCidInfo[sid]
            client.leave(cOId)
          }
          break
      }
    }

    delete this.sockInfo[client.id]
  }

  // AREA1 : socketP Area
  @SubscribeMessage('user connected')
  userConnected(client: Socket, payload: SocketUserConnectedType): void {
    // this.logger.log('USER CONNECTED : ')
    this.initSocketP(client, payload)
    payload.socketPId = client.id
    client.emit('user connected', payload)
  }
  @SubscribeMessage('test count')
  testCount(client: Socket, payload: SocketTestCountType): void {
    this.logger.log('Test Cnt from ' + payload.id)
    payload.cnt++
    client.emit('test count', payload)
  }
  @SubscribeMessage('test lock')
  async testLock(client: Socket, payload: any): Promise<void> {
    const readyNumber = await this.lockService.readyLock('test')

    // NOTE: DO SOMETHING

    this.lockService.releaseLock(readyNumber)
  }

  // AREA2 : socketChatArea
  @SubscribeMessage('chat connected')
  async chatConnected(client: Socket, payload: SocketChatConnectedType) {
    const ret = await this.initSocketC(client, payload)

    if (ret) {
      const cOId = payload.cOId
      const uOId = payload.uOId
      const ret2 = await this.useDBService.setUnreadChat(uOId, cOId, 0)
      if (ret2) {
        client.emit('chat connected', payload)
        // unreadCnt 는 클라이언트에서 반영해준다.
      }
    }
  }
  @SubscribeMessage('chat')
  async chat(client: Socket, payload: SocketChatContentType) {
    let debugNumber = 0
    if (
      !payload.jwt ||
      !payload.cOId ||
      !payload.body ||
      !payload.body.id ||
      !payload.body.uOId ||
      !payload.body.content
    ) {
      return
    }

    const isJwt = await this.gkdJwtService.verifyAsync(payload.jwt)
    if (!isJwt) {
      return
    }

    const cOId = payload.cOId
    const uOId = payload.body.uOId

    //  0. chat 에 lock 을 얻을때까지 기다리고 얻은 뒤에는 lock 을 건다.
    const readyNumber = await this.lockService.readyLock(`chat:${cOId}`)

    const isUser = await this.useDBService.ChatRoomHasUser(cOId, uOId)
    if (!isUser) {
      this.lockService.releaseLock(readyNumber)
      return
    }

    //  1. ChatRoomDB 에 넣고 속해있는 유저 정보{[uOId: string]: boolean}를 가져온다.
    const isInserted = await this.useDBService.insertChatBlock(cOId, payload.body)
    if (!isInserted) {
      this.lockService.releaseLock(readyNumber)
      return
    }
    //  2. 연결된 client 확인하는곳
    const connectedClientIds = Array.from(this.server.sockets.adapter.rooms.get(cOId))

    //  3. 연결된 유저는 채팅을 소켓으로 전송한다.
    this.server.to(cOId).emit('chat', payload)

    //  4. 채팅 소켓 연결 안 된 유저 확인
    const chatRoomUsers = this.getUnconnectedUsers(isInserted, connectedClientIds)

    //  5. 연결 안 된 유저는 안 읽은 메시지를 늘린다.
    //  6. sockP 연결된 유저는 안 읽은 개수 전송한다.
    this.processingUnconnectedUsers(chatRoomUsers, cOId)

    //  7. Lock 을 풀어준다.
    this.lockService.releaseLock(readyNumber)
  }

  // AREA1 : Private function Area

  private getUnconnectedUsers(
    usersObject: {[uOId: string]: boolean},
    connectedClientIds: string[]
  ) {
    const result = {...usersObject}
    connectedClientIds.forEach(clientId => {
      const uOId = this.sockCidInfo[clientId].uOId
      delete result[uOId]
    })
    return result
  }

  private initSocketP(client: Socket, payload: SocketUserConnectedType) {
    const uOid = payload.uOId
    const sid = client.id

    this.sockInfo[sid] = {
      type: 'P',
      uOId: uOid
    }

    if (!this.uOidInfo[uOid]) {
      this.uOidInfo[uOid] = {
        numConnectedP: 0,
        connectedP: {}
      }
    }
    this.uOidInfo[uOid].numConnectedP += 1
    this.uOidInfo[uOid].connectedP[sid] = true

    this.sockPidInfo[sid] = {
      uOId: uOid,
      cOId: '',
      sockChatId: ''
    }
  }

  private async initSocketC(client: Socket, payload: SocketChatConnectedType) {
    if (!payload.jwt || !payload.cOId || !payload.uOId || !payload.socketPId) {
      // this.logger.log("Payload isn't include information")
      return false
    }

    // JWT 인증
    const jwt = payload.jwt
    const isJwt = await this.gkdJwtService.verifyAsync(jwt)
    if (!isJwt || isJwt.uOId !== payload.uOId) {
      // this.logger.log('JWT Veryfing error')
      return false
    }

    // 채팅방 OId 에 따른 room 구현
    // this.logger.log(`${client.id} join to ${payload.cOId}`)
    client.join(payload.cOId)

    // 클래스 내부에 채팅소켓 들어온것에 대한 정보 기입
    this.sockCidInfo[client.id] = {
      uOId: payload.uOId,
      sockPid: client.id,
      cOId: payload.cOId
    }
    if (!this.sockPidInfo[payload.socketPId]) {
      this.sockPidInfo[payload.socketPId] = {
        uOId: payload.uOId,
        sockChatId: client.id,
        cOId: payload.cOId
      }
    }
    this.sockPidInfo[payload.socketPId].sockChatId = client.id
    this.sockPidInfo[payload.socketPId].cOId = payload.cOId
    return true
  }

  private processingUnconnectedUsers(
    chatRoomUsers: {[suOId: string]: boolean},
    cOId: string
  ) {
    const remainUsers = Object.keys(chatRoomUsers)
    remainUsers.forEach(async _uOId => {
      //  5. 연결 안 된 유저는 안 읽은 메시지를 늘린다.
      const newUnreadChat = await this.useDBService.increaseUnreadChat(_uOId, cOId)

      //  6. sockP 연결된 유저는 안 읽은 개수 전송한다.
      if (this.uOidInfo[_uOId] && this.uOidInfo[_uOId].numConnectedP > 0) {
        const sockPids = Object.keys(this.uOidInfo[_uOId].connectedP)
        const payload: SocketSetUnreadChatType = {
          uOId: _uOId,
          cOId: cOId,
          unreadChat: newUnreadChat
        }
        sockPids.forEach(sockPId => {
          const socketP = this.server.sockets.sockets.get(sockPId)
          if (socketP) {
            socketP.emit('set unread chat', payload)
          }
        })
      }
    })
  }
  // BLANK LINE COMMENT:
}
