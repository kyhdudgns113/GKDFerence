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
import {SocketTestCountType, SocketUserConnectedType} from './socket.types'

@WebSocketGateway({cors: true}) // Enable CORS if needed
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server
  private logger: Logger = new Logger('SocketGateway')

  afterInit(server: Server) {
    this.logger.log('Init')
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('user connected')
  userConnect(client: Socket, payload: SocketUserConnectedType): void {
    this.logger.log('USER CONNECTED : ', payload.id)
    client.emit('message', payload)
  }
  @SubscribeMessage('test count')
  testCount(client: Socket, payload: SocketTestCountType): void {
    this.logger.log('Test Cnt ')
    payload.cnt++
    client.emit('test count', payload)
  }

  // @SubscribeMessage('message')
  // message(client: Socket, payload: {sender: string; message: string}): void {
  //   console.log('MESSAGE ', payload)
  //   client.emit('message', payload)
  // }
}
