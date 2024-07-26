import {Module} from '@nestjs/common'
import {SocketGateway} from './socket.gateway'
import {UseDBModule} from '../useDB/useDB.module'
import {LockModule} from '../lock/lock.module'
import {GkdJwtModule} from '../gkdJwt/gkdJwt.module'

@Module({
  imports: [GkdJwtModule, LockModule, UseDBModule],
  providers: [SocketGateway]
})
export class SocketModule {}
