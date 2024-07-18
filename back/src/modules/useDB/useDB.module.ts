import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {PassportModule} from '@nestjs/passport'

import {gkdJwtSecret, gkdJwtSignOption, JwtStrategy} from 'src/common'
import {UseDBService} from './useDB.service'
import {ChatRoomDBModule} from './chatRoomDB/chatRoomDB.module'
import {UserDBModule} from './userDB/userDB.module'

@Module({
  imports: [
    ChatRoomDBModule,
    UserDBModule, //
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
