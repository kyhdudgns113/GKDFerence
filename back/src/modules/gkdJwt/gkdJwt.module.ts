import {Module} from '@nestjs/common'
import {GkdJwtService} from './gkdJwt.service'
import {JwtModule} from '@nestjs/jwt'
import {gkdJwtSecret, gkdJwtSignOption} from 'src/common'

@Module({
  imports: [
    JwtModule.register({
      secret: gkdJwtSecret,
      signOptions: gkdJwtSignOption
    })
  ],
  providers: [GkdJwtService],
  exports: [GkdJwtService]
})
export class GkdJwtModule {}
