import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {PassportModule} from '@nestjs/passport'

import {UserModule} from 'src/modules/useDB/user/user.module'
import {gkdJwtSecret, gkdJwtSignOption, JwtStrategy} from 'src/common'
import {UseDBService} from './useDB.service'

@Module({
  imports: [
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
