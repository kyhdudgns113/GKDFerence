import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {PassportModule} from '@nestjs/passport'

import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'
import {JwtStrategy} from 'src/common'
import {UseDBModule} from '../useDB/useDB.module'
import {GkdJwtModule} from '../gkdJwt/gkdJwt.module'

@Module({
  imports: [
    GkdJwtModule,
    PassportModule,
    UseDBModule //
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
