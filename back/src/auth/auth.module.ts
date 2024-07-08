import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {PassportModule} from '@nestjs/passport'

import {gkdJwtSecret, gkdJwtSignOption} from '../server_secret'
import {JwtStrategy} from '../jwt'
import {UserModule} from 'src/user/user.module'
import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'

@Module({
  imports: [
    UserModule, //
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
