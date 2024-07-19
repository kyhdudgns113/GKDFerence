import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {gkdJwtSecret, gkdJwtSignOption} from 'src/common'
import {UseDBModule} from 'src/modules/useDB/useDB.module'
import {ChatRoomsService} from './chatRooms.service'
import {ChatRoomModule} from './chatRoom/chatRoom.module'

@Module({
  imports: [
    ChatRoomModule,
    UseDBModule,
    JwtModule.register({
      secret: gkdJwtSecret,
      signOptions: gkdJwtSignOption
    })
  ],
  providers: [ChatRoomsService],
  exports: [ChatRoomsService]
})
export class ChatRoomsModule {}
