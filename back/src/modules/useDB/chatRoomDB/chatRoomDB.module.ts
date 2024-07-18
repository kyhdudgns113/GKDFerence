import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {ChatBlock, ChatBlockSchema, ChatRoom, ChatRoomSchema} from './chatRoomDB.entity'
import {ChatRoomDBService} from './chatRoomDB.service'

@Module({
  imports: [
    MongooseModule.forFeature([{name: ChatRoom.name, schema: ChatRoomSchema}]),
    MongooseModule.forFeature([{name: ChatBlock.name, schema: ChatBlockSchema}])
  ],
  providers: [ChatRoomDBService],
  exports: [ChatRoomDBService]
})
export class ChatRoomDBModule {}
