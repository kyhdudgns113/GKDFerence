import {Module} from '@nestjs/common'
import {SidebarController} from './sidebar.controller'
import {SidebarService} from './sidebar.service'
import {UseDBModule} from '../useDB/useDB.module'
import {ChatRoomsModule} from './chatRooms/chatRooms.module'
import {LockModule} from '../lock/lock.module'
import {GkdJwtModule} from '../gkdJwt/gkdJwt.module'
import {DocumentGsModule} from './documentGs/documentGs.module'

@Module({
  imports: [ChatRoomsModule, DocumentGsModule, GkdJwtModule, LockModule, UseDBModule],
  controllers: [SidebarController],
  providers: [SidebarService]
})
export class SidebarModule {}
