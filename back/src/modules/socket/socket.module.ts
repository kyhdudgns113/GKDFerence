import {Module} from '@nestjs/common'
import {SocketGateway} from './socket.gateway'
import {JwtModule} from '@nestjs/jwt'
import {gkdJwtSecret, gkdJwtSignOption} from 'src/common'
import {UseDBModule} from '../useDB/useDB.module'

@Module({
  imports: [
    UseDBModule,
    JwtModule.register({
      secret: gkdJwtSecret,
      signOptions: gkdJwtSignOption
    })
  ],
  providers: [SocketGateway]
})
export class SocketModule {}
