import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {PassportModule} from '@nestjs/passport'

import {gkdJwtSecret, gkdJwtSignOption, JwtStrategy} from 'src/common'
import {UseDBService} from './useDB.service'
import {ChatRoomModule} from './chatroom/chatroom.module'
import {UserModule} from './user/user.module'

@Module({
  imports: [
    ChatRoomModule,
    UserModule, //
    PassportModule,
    JwtModule.register({
      secret: gkdJwtSecret,
      signOptions: gkdJwtSignOption
    })
  ],
  providers: [UseDBService, JwtStrategy],
  exports: [UseDBService]
})
export class UseDBModule {}
