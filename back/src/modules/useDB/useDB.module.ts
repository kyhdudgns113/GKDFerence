import {Module} from '@nestjs/common'
import {UseDBService} from './useDB.service'
import {ChatRoomDBModule} from './chatRoomDB/chatRoomDB.module'
import {UserDBModule} from './userDB/userDB.module'
import {DocumentGDBModule} from './documentGDB/documentGDB.module'

@Module({
  imports: [
    ChatRoomDBModule,
    DocumentGDBModule,
    UserDBModule //
  ],
  providers: [UseDBService],
  exports: [UseDBService]
})
export class UseDBModule {}
