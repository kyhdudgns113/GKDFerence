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
import {SocketTestCountType, SocketUserConnectedType} from 'src/common'

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

  afterInit(server: Server) {
    this.logger.log('Init')
    server.sockets.sockets.forEach(socket => {
      this.logger.log(`Disconnect prev socket : ${socket.id}`)
      socket.emit('disconnect', 'disconnect')
    })
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)

    const sid = client.id

    // NOTE: If server is reset, this.~~ is also reset.
    // NOTE: So we need to check if it was validate
    if (this.sockInfo[sid]) {
      switch (this.sockInfo[sid].type) {
        case 'P':
          {
            const uOid = this.sockInfo[sid].uOid
            delete this.sockPidInfo[sid]

            this.uOidInfo[uOid].numConnectedP -= 1
            delete this.uOidInfo[uOid].connectedP[sid]
            if (this.uOidInfo[uOid].numConnectedP === 0) {
              delete this.uOidInfo[uOid]
            }
            // TODO: delete chat socket inside socketP
          }
          break
        case 'Chat':
          {
            const pid = this.sockCidInfo[sid].sockPid

            this.sockPidInfo[pid].sockChatId = ''
            this.sockPidInfo[pid].chatId = ''
          }
          break
      }
    }

    delete this.sockInfo[client.id]
  }

  @SubscribeMessage('user connected')
  userConnected(client: Socket, payload: SocketUserConnectedType): void {
    this.logger.log('USER CONNECTED : ' + payload._id)
    this.initSocketP(client, payload)
    client.emit('user connected', payload)
  }

  @SubscribeMessage('test count')
  testCount(client: Socket, payload: SocketTestCountType): void {
    this.logger.log('Test Cnt from ' + payload.id)
    payload.cnt++
    client.emit('test count', payload)
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
