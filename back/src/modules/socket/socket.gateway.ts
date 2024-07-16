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
  JwtPayload,
  SocketChatConnectedType,
  SocketTestCountType,
  SocketUserConnectedType
} from 'src/common'
import {JwtService} from '@nestjs/jwt'

@WebSocketGateway({cors: true}) // Enable CORS if needed
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server
  private logger: Logger = new Logger('SocketGateway')

  private sockInfo: {
    [sockId: string]: {
      type: 'P' | 'Chat'
      uOid: string
    }
  } = {}
  private uOidInfo: {
    [uOid: string]: {
      numConnectedP: number
      connectedP: {[sockPid: string]: boolean}
    }
  } = {}
  private sockPidInfo: {
    [sockPid: string]: {
      uOid: string
      sockChatId: string
      chatId: string
    } | null
  } = {}
  private sockCidInfo: {
    [sockCid: string]: {
      uOid: string
      sockPid: string
      chatId: string
    }
  } = {}

  constructor(private jwtService: JwtService) {}

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
            const uOid = this.sockInfo[sid].uOid
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
            const pid = this.sockCidInfo[sid].sockPid

            this.sockPidInfo[pid].sockChatId = ''
            this.sockPidInfo[pid].chatId = ''

            delete this.sockCidInfo[sid]
          }
          break
      }
    }

    delete this.sockInfo[client.id]
  }

  // AREA1 : socketP Area
  @SubscribeMessage('user connected')
  userConnected(client: Socket, payload: SocketUserConnectedType): void {
    this.logger.log('USER CONNECTED : ' + payload._id)
    this.initSocketP(client, payload)
    payload.pid = client.id
    client.emit('user connected', payload)
  }
  @SubscribeMessage('test count')
  testCount(client: Socket, payload: SocketTestCountType): void {
    this.logger.log('Test Cnt from ' + payload.id)
    payload.cnt++
    client.emit('test count', payload)
  }

  // AREA1 : socketChatArea
  @SubscribeMessage('chat connected')
  async chatConnected(client: Socket, payload: SocketChatConnectedType) {
    if (!payload.jwt || !payload.cOId || !payload.uOId || !payload.socketPId) {
      // this.logger.log("Payload isn't include information")
      return
    }

    // JWT 인증
    const jwt = payload.jwt
    const isJwt = (await this.jwtService.verifyAsync(jwt)) as JwtPayload
    if (!isJwt || isJwt._id !== payload.uOId) {
      // this.logger.log('JWT Veryfing error')
      return
    }
    // 채팅방 OId 에 따른 room 구현
    client.join(payload.cOId)

    // 클래스 내부에 채팅소켓 들어온것에 대한 정보 기입
    this.sockCidInfo[client.id] = {
      uOid: payload.uOId,
      sockPid: client.id,
      chatId: payload.cOId
    }

    this.sockPidInfo[payload.socketPId].sockChatId = client.id
    this.sockPidInfo[payload.socketPId].chatId = payload.cOId

    client.emit('chat connected', payload)
  }

  private initSocketP(client: Socket, payload: SocketUserConnectedType) {
    const uOid = payload._id
    const sid = client.id

    this.sockInfo[sid] = {
      type: 'P',
      uOid: uOid
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
      uOid: uOid,
      chatId: '',
      sockChatId: ''
    }
  }
  // BLANK LINE COMMENT
}
