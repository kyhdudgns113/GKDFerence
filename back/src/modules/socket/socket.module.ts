import {Module} from '@nestjs/common'
import {SocketGateway} from './socket.gateway'
import {JwtModule} from '@nestjs/jwt'
import {gkdJwtSecret, gkdJwtSignOption} from 'src/common'
import {UseDBModule} from '../useDB/useDB.module'
import {LockModule} from '../lock/lock.module'

@Module({
  imports: [
    LockModule,
    UseDBModule,
    JwtModule.register({
      secret: gkdJwtSecret,
      signOptions: gkdJwtSignOption
    })
  ],
  providers: [SocketGateway]
})
export class SocketModule {}
