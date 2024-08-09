import {Injectable} from '@nestjs/common'
import {UseDBService} from '../useDB/useDB.service'
import {SidebarBodyType} from 'src/common'
import {ChatRoomsService} from './chatRooms/chatRooms.service'
import {DocumentGsService} from './documentGs/documentGs.service'

// NOTE: JWT 검증은 controller 에서 한다.
// NOTE: 그 외의 검증은 여기서 해야한다.
@Injectable()
export class SidebarService {
  constructor(
    private chatRoomsService: ChatRoomsService,
    private documentGsService: DocumentGsService,
    private useDBService: UseDBService
  ) {}

  /**
   *
   * @param body : Information for user
   * @param idOrEmail : Target user's info
   * @returns
   */
  async createSingleChatRoom(body: SidebarBodyType, idOrEmail: string) {
    const ret = this.chatRoomsService.createSingleChatRoom(body, idOrEmail)
    return ret
  }

  async createDocument(body: SidebarBodyType) {
    const dOId = await this.documentGsService.createDocumentG(body)
    if (!dOId) {
      return {
        ok: false,
        body: {},
        errors: {create: '문서 생성 에러'}
      }
    }

    const uOId = body.uOId

    const ret = this.useDBService.addDocumentG(uOId, dOId)
    if (ret) {
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
        errors: {add: '유저에 문서 추가 에러'}
      }
    }
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
      body: {id: user.id, email: user.email, uOId: user._id},
      errors: {}
    }
  }

  async getChatBlocks(uOId: string, cOId: string, firstIdx: number) {
    const valid = await this.useDBService.ChatRoomHasUser(cOId, uOId)
    if (!valid) {
      return {
        ok: false,
        body: {},
        errors: {id: '해당 id 는 이 채팅방에 권한이 없습니다.'}
      }
    }

    const chatBlocks = await this.chatRoomsService.getChatBlocks(uOId, cOId, firstIdx)
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

  // NOTE: It will be upgraded by including group chatRooms
  async getChatRooms(uOId: string) {
    const chatRooms = await this.chatRoomsService.getChatRooms(uOId)
    if (chatRooms === null) {
      return {
        ok: false,
        body: {},
        errors: {uOId: "User isn't exist"}
      }
    } // BLANK LINE COMMENT:
    else {
      return {
        ok: true,
        body: {chatRooms: chatRooms},
        errors: {}
      }
    }
  }

  async getDocumentG(uOId: string, dOId: string) {
    const valid = await this.useDBService.DocumentGHasUser(dOId, uOId)
    if (!valid) {
      return {
        ok: false,
        body: {},
        errors: {id: '해당 id 는 이 문서에 권한이 없습니다. '}
      }
    }

    const ret = await this.documentGsService.getDocumentG(dOId)
    if (!ret) {
      return {
        ok: false,
        body: {},
        errors: {
          title: '제목을 가져오는데 실패했습니다.',
          contents: '내용을 가져오는데 실패했습니다.'
        }
      }
    }
    return {
      ok: true,
      body: {title: ret.title, contents: ret.contents},
      errors: {}
    }
  }

  async getSidebars(uOId: string) {
    const chatRooms = await this.chatRoomsService.getChatRooms(uOId)
    if (chatRooms === null) {
      return {
        ok: false,
        body: {},
        errors: {uOId: 'chatRooms is null in getSidebars'}
      }
    }

    const documentGs = await this.documentGsService.getDocumentGs(uOId)
    if (documentGs === null) {
      return {
        ok: false,
        body: {},
        errors: {dOId: 'documentGs is null in getSidebars'}
      }
    }

    return {
      ok: true,
      body: {chatRooms: chatRooms, documentGs: documentGs},
      errors: {}
    }
  }

  // BLANK LINE COMMENT
}
