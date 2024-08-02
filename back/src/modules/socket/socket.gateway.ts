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
  SocketChatConnectedType,
  SocketChatContentType,
  SocketDocChangeType,
  SocketDocConnectedType,
  SocketDocRequestLockType,
  SocketSetUnreadChatType,
  SocketTestCountType,
  SocketUserConnectedType
} from 'src/common'
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
      type: 'P' | 'Chat' | 'Doc'
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
      sockChatOrDocId: string
      cOrdId: string
    } | null
  } = {}
  private sockCidInfo: {
    [sockCid: string]: {
      uOId: string
      sockPid: string
      cOId: string
    }
  } = {}
  private sockDidInfo: {
    [sockDid: string]: {
      uOId: string
      sockPid: string
      dOId: string
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
            delete this.sockPidInfo[sid]

            this.uOidInfo[uOid].numConnectedP -= 1
            delete this.uOidInfo[uOid].connectedP[sid]
            if (this.uOidInfo[uOid].numConnectedP === 0) {
              delete this.uOidInfo[uOid]
            }
            // NOTE: sockC 와 sockD 도 연결이 끊어지기 때문에 이 함수가 또 호출된다.
          }
          break
        case 'Chat':
          {
            const cOId = this.sockCidInfo[sid].cOId
            const pid = this.sockCidInfo[sid].sockPid

            if (this.sockPidInfo[pid]) {
              this.sockPidInfo[pid].sockChatOrDocId = ''
              this.sockPidInfo[pid].cOrdId = ''
            }

            delete this.sockCidInfo[sid]
            client.leave(cOId)
          }
          break
        case 'Doc':
          {
            const dOId = this.sockDidInfo[sid].dOId
            const pid = this.sockDidInfo[sid].sockPid

            if (this.sockPidInfo[pid]) {
              this.sockPidInfo[pid].sockChatOrDocId = ''
              this.sockPidInfo[pid].cOrdId = ''
            }

            delete this.sockDidInfo[sid]
            client.leave(dOId)
          }
          break
      }
    }

    delete this.sockInfo[client.id]
  }

  // AREA1 : socketP Area
  @SubscribeMessage('user connected')
  userConnected(client: Socket, payload: SocketUserConnectedType): void {
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

  // AREA1 : socketDocumentGArea
  @SubscribeMessage('documentG connected')
  async documentGConnected(client: Socket, payload: SocketDocConnectedType) {
    const ret = await this.initSocketD(client, payload)
    if (ret) {
      client.emit('document connected', payload)
    }
  }
  @SubscribeMessage('documentG request lock')
  async documentGRequestLock(client: Socket, payload: SocketDocRequestLockType) {
    const dOId = payload.dOId
    const readyLock = await this.lockService.readyLock(`documentG:${dOId}`)
    payload.readyLock = readyLock
    client.emit('documentG request lock', payload)
  }
  @SubscribeMessage('documentG send change info')
  async documentGSendChangeInfo(client: Socket, payload: SocketDocChangeType) {
    const jwtFromClient = payload.jwt
    try {
      const jwtPayload = await this.gkdJwtService.verifyAsync(jwtFromClient)
    } catch (err) {
      // TODO: JWT 만료시 해야 할 일
      // TODO: return ok: false 는 아니다. 여기 소켓이다.
    }

    const readyLock = payload.readyLock || ''
    const dOId = payload.dOId
    const lockState = this.lockService.checkReadyLockWithNowNumber(readyLock)

    if (lockState === 'miss') {
      payload.startRow = null
      payload.endRow = null
      client.emit('documentG send change info', payload)
      return
    } else if (lockState === 'never' || lockState === 'ready') {
      // NOTE: 뭔가를 해야할까?
      return
    }
    // 이건 더이상 쓰지 않는다.
    payload.readyLock = ''

    // 1. DB 를 수정한다.
    // TODO: 유저 무결성 검증
    await this.useDBService.applyDocumentGChangeInfo(payload)

    // 2. 연결된 소켓들에게 "수정 정보" 를 전송한다.
    this.server.to(dOId).emit('documentG send change info', payload)

    // 3. Release Lock 을 해준다.
    this.lockService.releaseLock(readyLock)
  }

  // AREA2 : Private function Area

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
      cOrdId: '',
      sockChatOrDocId: ''
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

    this.sockInfo[client.id] = {
      type: 'Chat',
      uOId: payload.uOId
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
        sockChatOrDocId: client.id,
        cOrdId: payload.cOId
      }
    }
    this.sockPidInfo[payload.socketPId].sockChatOrDocId = client.id
    this.sockPidInfo[payload.socketPId].cOrdId = payload.cOId
    return true
  }

  private async initSocketD(client: Socket, payload: SocketDocConnectedType) {
    if (!payload.jwt || !payload.dOId || !payload.uOId || !payload.socketPId) {
      return false
    }

    // JWT 인증
    const jwt = payload.jwt
    const isJwt = await this.gkdJwtService.verifyAsync(jwt)
    if (!isJwt || isJwt.uOId !== payload.uOId) {
      // this.logger.log('JWT Veryfing error')
      return false
    }

    this.sockInfo[client.id] = {
      type: 'Doc',
      uOId: payload.uOId
    }

    // 채팅방 OId 에 따른 room 구현
    // this.logger.log(`${client.id} join to ${payload.cOId}`)
    client.join(payload.dOId)

    // 클래스 내부에 채팅소켓 들어온것에 대한 정보 기입
    this.sockDidInfo[client.id] = {
      uOId: payload.uOId,
      sockPid: client.id,
      dOId: payload.dOId
    }

    if (!this.sockPidInfo[payload.socketPId]) {
      this.sockPidInfo[payload.socketPId] = {
        uOId: payload.uOId,
        sockChatOrDocId: client.id,
        cOrdId: payload.dOId
      }
    }

    this.sockPidInfo[payload.socketPId].sockChatOrDocId = client.id
    this.sockPidInfo[payload.socketPId].cOrdId = payload.dOId

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
