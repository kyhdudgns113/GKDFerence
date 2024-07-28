import {Module} from '@nestjs/common'
import {UseDBModule} from 'src/modules/useDB/useDB.module'
import {DocumentGService} from './documentG.service'

@Module({
  imports: [UseDBModule],
  providers: [DocumentGService],
  exports: [DocumentGService]
})
export class ChatRoomModule {}
