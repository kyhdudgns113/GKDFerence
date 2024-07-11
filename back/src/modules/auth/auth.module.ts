import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {PassportModule} from '@nestjs/passport'

import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'
import {gkdJwtSecret, gkdJwtSignOption, JwtStrategy} from 'src/common'
import {UseDBModule} from '../useDB/useDB.module'

@Module({
  imports: [
    UseDBModule, //
    PassportModule,
    JwtModule.register({
      secret: gkdJwtSecret,
      signOptions: gkdJwtSignOption
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
