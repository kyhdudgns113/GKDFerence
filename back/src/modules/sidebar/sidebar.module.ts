import {Module} from '@nestjs/common'
import {SidebarController} from './sidebar.controller'
import {SidebarService} from './sidebar.service'
import {UseDBModule} from '../useDB/useDB.module'
import {JwtModule} from '@nestjs/jwt'
import {gkdJwtSecret, gkdJwtSignOption} from 'src/common'
import {ChatRoomsModule} from './chatRooms/chatRooms.module'
import {LockModule} from '../lock/lock.module'

@Module({
  imports: [
    ChatRoomsModule,
    LockModule,
    UseDBModule,
    JwtModule.register({
      secret: gkdJwtSecret,
      signOptions: gkdJwtSignOption
    })
  ],
  controllers: [SidebarController],
  providers: [SidebarService]
})
export class SidebarModule {}
