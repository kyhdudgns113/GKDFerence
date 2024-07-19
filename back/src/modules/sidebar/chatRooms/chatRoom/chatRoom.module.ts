import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {gkdJwtSecret, gkdJwtSignOption} from 'src/common'
import {UseDBModule} from 'src/modules/useDB/useDB.module'
import {ChatRoomService} from './chatRoom.service'

@Module({
  imports: [
    UseDBModule,
    JwtModule.register({
      secret: gkdJwtSecret,
      signOptions: gkdJwtSignOption
    })
  ],
  providers: [ChatRoomService],
  exports: [ChatRoomService]
})
export class ChatRoomModule {}
