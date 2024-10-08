import {Module} from '@nestjs/common'
import {UseDBModule} from 'src/modules/useDB/useDB.module'
import {ChatRoomService} from './chatRoom.service'

@Module({
  imports: [UseDBModule],
  providers: [ChatRoomService],
  exports: [ChatRoomService]
})
export class ChatRoomModule {}
