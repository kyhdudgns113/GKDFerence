import {Injectable} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {gkdJwtSignOption, SidebarBodyType} from 'src/common'
import {UseDBService} from 'src/modules/useDB/useDB.service'

@Injectable()
export class ChatListService {
  constructor(
    private useDBService: UseDBService,
    private jwtService: JwtService
  ) {}

  /**
   *
   * @param body : Information for user
   * @param idOrEmail : Target user's info
   * @returns
   */
  async createSingleChatRoom(body: SidebarBodyType, idOrEmail: string) {
    const {jwt} = body

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
    if (user.id === body.id) {
      return {
        ok: false,
        body: {},
        errors: {idOrEmail: '자신과의 채팅은 아직 구현이 안되어있습니다.'}
      }
    }

    const isExistChatroom = await this.useDBService.findSingleChatRoom(body.id, user.id)
    if (isExistChatroom) {
      return {
        ok: false,
        body: {isExistChatroom},
        errors: {chatRoom: '이미 채팅방이 있습니다.'}
      }
    }

    const chatRoom = await this.useDBService.createSingleChatRoom(
      body._id,
      user._id.toString()
    )
    if (chatRoom) {
      return {
        ok: true,
        body: {},
        errors: {}
      }
    } else {
      return {
        ok: false,
        body: {},
        errors: {chatRoom: 'Create room failed'}
      }
    }
  }

  async getUserChatRoomList(jwt: string, uOId: string) {
    const isJwt = await this.jwtService.verifyAsync(jwt, gkdJwtSignOption)
    if (!isJwt) {
      return {
        ok: false,
        body: {},
        errors: {jwt: 'JWT Error in Sidebar findUser'}
      }
    }

    const chatRoomList = await this.useDBService.findChatRoomList(uOId)
    if (chatRoomList === null) {
      return {
        ok: false,
        body: {},
        errors: {uOId: "User isn't exist"}
      }
    } else {
      return {
        ok: true,
        body: {chatRoomList: chatRoomList},
        errors: {}
      }
    }
  }

  // BLANK LINE COMMENT
}
