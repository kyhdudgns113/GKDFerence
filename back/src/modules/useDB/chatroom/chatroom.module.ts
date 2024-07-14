import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {ChatRoom, ChatRoomSchema} from './chatroom.entity'
import {ChatRoomService} from './chatroom.service'

@Module({
  imports: [MongooseModule.forFeature([{name: ChatRoom.name, schema: ChatRoomSchema}])],
  providers: [ChatRoomService],
  exports: [ChatRoomService]
})
export class ChatRoomModule {}
