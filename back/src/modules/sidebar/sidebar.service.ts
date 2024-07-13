import {Injectable} from '@nestjs/common'
import {UseDBService} from '../useDB/useDB.service'
import {JwtService} from '@nestjs/jwt'
import {gkdJwtSignOption} from 'src/common'

@Injectable()
export class SidebarService {
  constructor(
    private useDBService: UseDBService,
    private jwtService: JwtService
  ) {}

  async findUser(jwt: string, idOrEmail: string) {
    const isJwt = await this.jwtService.verifyAsync(jwt, gkdJwtSignOption)
    if (!isJwt) {
      return {
        ok: false,
        body: {},
        errors: {jwt: 'JWT Error in Sidebar findUser'}
      }
    }

    const user = await this.useDBService.findUserByIdOrEmail(idOrEmail)
    if (!user) {
      return {
        ok: false,
        body: {},
        errors: {idOrEmail: "User isn't exist"}
      }
    }

    return {
      ok: true,
      body: {id: user.id, email: user.email, _id: user._id},
      errors: {}
    }
  }

  // BLANK LINE COMMENT
}
