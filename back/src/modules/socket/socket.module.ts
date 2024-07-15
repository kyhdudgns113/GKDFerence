import {Module} from '@nestjs/common'
import {SocketGateway} from './socket.gateway'
import {JwtModule} from '@nestjs/jwt'
import {gkdJwtSecret, gkdJwtSignOption} from 'src/common'

@Module({
  imports: [
    JwtModule.register({
      secret: gkdJwtSecret,
      signOptions: gkdJwtSignOption
    })
  ],
  providers: [SocketGateway]
})
export class SocketModule {}
