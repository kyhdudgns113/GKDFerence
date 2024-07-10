import {Injectable} from '@nestjs/common'
import {PassportStrategy} from '@nestjs/passport'
import {ExtractJwt, Strategy} from 'passport-jwt'
import {JwtPayload} from 'src/common'
import {gkdJwtSecret} from 'src/server_secret'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: gkdJwtSecret
    })
  }

  async validate(payload: JwtPayload) {
    return {id: payload.id, email: payload.email}
  }
}
