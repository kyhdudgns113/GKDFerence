import {Injectable} from '@nestjs/common'
import {UseDBService} from '../useDB/useDB.service'
import {SidebarBodyType} from 'src/common'
import {ChatListService} from './chatList/chatList.service'

// NOTE: JWT 검증은 controller 에서 한다.
// NOTE: 그 외의 검증은 여기서 해야한다.
@Injectable()
export class SidebarService {
  constructor(
    private chatListService: ChatListService,
    private useDBService: UseDBService
  ) {}

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

  async findUserIdOrEmail(idOrEmail: string) {
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

  async getChatBlocks(uOId: string, cOId: string) {
    const valid = await this.useDBService.ChatRoomHasUser(cOId, uOId)
    if (!valid) {
      return {
        ok: false,
        body: {},
        errors: {id: '해당 id 는 이 채팅방에 권한이 없습니다.'}
      }
    }

    const chatBlocks = await this.chatListService.getChatBlocks(uOId, cOId)
    if (!chatBlocks) {
      return {
        ok: false,
        body: {},
        errors: {chatRoom: '채팅 블록을 가져오는데 실패했습니다.'}
      }
    }
    return {
      ok: true,
      body: {chatBlocks: chatBlocks},
      errors: {}
    }
  }

  // NOTE: It will be upgraded by including group chat list
  async getUserChatRoomList(uOId: string) {
    const ret = await this.chatListService.getUserChatRoomList(uOId)
    return ret
  }

  // BLANK LINE COMMENT
}
