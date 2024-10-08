import {Injectable} from '@nestjs/common'
import {SidebarBodyType} from 'src/common'
import {UseDBService} from 'src/modules/useDB/useDB.service'

@Injectable()
export class ChatRoomsService {
  constructor(private useDBService: UseDBService) {}

  /**
   *
   * @param body : Information for user
   * @param idOrEmail : Target user's info
   * @returns
   */
  async createSingleChatRoom(body: SidebarBodyType, idOrEmail: string) {
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
      body.uOId,
      user._id.toString()
    )
    if (chatRoom) {
      return {
        ok: true,
        body: {},
        errors: {}
      }
    } // BLANK LINE COMMENT:
    else {
      return {
        ok: false,
        body: {},
        errors: {chatRoom: 'Create room failed'}
      }
    }
  }

  // NOTE: uOId 는 나중을 위해 냅둔다.
  // NOTE: 해당 유저가 안 읽은 메시지 개수 불러올때 쓰일 예정
  async getChatBlocks(uOId: string, cOId: string, firstIdx: number) {
    const chatBlocks = await this.useDBService.getChatBlocks(cOId)
    if (firstIdx > 0) {
      return chatBlocks.slice(firstIdx >= 10 ? firstIdx - 10 : 0, firstIdx)
    } // BLANK LINE COMMENT:
    else {
      const len = chatBlocks.length
      return chatBlocks.slice(len - 10, len)
    }
  }

  async getChatRooms(uOId: string) {
    const chatRooms = await this.useDBService.findChatRooms(uOId)
    return chatRooms
  }

  // BLANK LINE COMMENT
}
