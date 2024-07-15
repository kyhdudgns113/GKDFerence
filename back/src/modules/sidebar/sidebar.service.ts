import {Injectable} from '@nestjs/common'
import {UseDBService} from '../useDB/useDB.service'
import {JwtService} from '@nestjs/jwt'
import {gkdJwtSignOption, SidebarBodyType} from 'src/common'
import {ChatListService} from './chatList/chatList.service'

@Injectable()
export class SidebarService {
  constructor(
    private chatListService: ChatListService,
    private useDBService: UseDBService,
    private jwtService: JwtService
  ) {}

  async findUserIdOrEmail(jwt: string, idOrEmail: string) {
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

  // NOTE: It will be upgraded by including group chat list
  async getUserChatRoomList(jwt: string, uOId: string) {
    const ret = await this.chatListService.getUserChatRoomList(jwt, uOId)
    return ret
  }

  /**
   *
   * @param body : Information for user
   * @param idOrEmail : Target user's info
   * @returns
   */
  async createSingleChatRoom(body: SidebarBodyType, idOrEmail: string) {
    const ret = this.chatListService.createSingleChatRoom(body, idOrEmail)
    return ret
  }
  // BLANK LINE COMMENT
}
