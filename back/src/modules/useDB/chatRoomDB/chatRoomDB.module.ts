import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {ChatRoom, ChatRoomSchema} from './chatRoomDB.entity'
import {ChatRoomDBService} from './chatRoomDB.service'

@Module({
  imports: [MongooseModule.forFeature([{name: ChatRoom.name, schema: ChatRoomSchema}])],
  providers: [ChatRoomDBService],
  exports: [ChatRoomDBService]
})
export class ChatRoomDBModule {}
