import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {PassportModule} from '@nestjs/passport'

import {AuthController, AuthService} from '../auth'
import {UserModule} from '../user'
import {gkdJwtSecret, gkdJwtSignOption} from '../server_secret'
import {JwtStrategy} from '../jwt'

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
