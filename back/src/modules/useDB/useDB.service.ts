import {Injectable} from '@nestjs/common'

import {CreateUserDto} from 'src/modules/useDB/userDB/dto'
import {ChatRoomDBService} from './chatRoomDB/chatRoomDB.service'
import {
  ChatBlockType,
  RowDocumentGType,
  RowSingleChatRoomType,
  SocketDocChangeType
} from 'src/common'
import {UserDBService} from './userDB/userDB.service'
import {DocumentGDBService} from './documentGDB/documentGDB.service'

/**
 * // NOTE: DON'T RETURN {ok, body, errors} type
 */
@Injectable()
export class UseDBService {
  constructor(
    private chatRoomDBService: ChatRoomDBService,
    private documentGDBService: DocumentGDBService,
    private userDBService: UserDBService
  ) {}

  async addDocumentG(uOId: string, dOId: string) {
    return await this.userDBService.addDocumentG(uOId, dOId)
  }

  async addUserToDocumentG(dOId: string, idOrEmail: string) {
    const user = await this.userDBService.findOneByIdOrEmail(idOrEmail)
    if (!user) {
      throw {idOrEmail: `User isn't exist`}
    }

    const documentG = await this.documentGDBService.findOneByObjectId(dOId)
    if (!documentG) {
      throw {dOId: `Document isn't exist`}
    }

    const uOId = user._id.toString()
    const docHasUser = await this.documentGDBService.documentGHasUser(dOId, uOId)
    if (docHasUser) {
      throw {uOId: `User already has enjoyed`}
    }

    const ret1 = await this.userDBService.addDocumentG(uOId, dOId)
    if (!ret1) {
      throw {error: `Adding document error`}
    }
    const ret = await this.documentGDBService.addUserToDocumentG(dOId, uOId)
    return ret
  }

  async applyDocumentGChangeInfo(payload: SocketDocChangeType) {
    const ret = await this.documentGDBService.applyDocumentGChangeInfo(payload)
    return ret
  }

  async ChatRoomHasUser(cOId: string, uOId: string) {
    return await this.chatRoomDBService.chatRoomHasUser(cOId, uOId)
  }

  async DocumentGHasUser(dOId: string, uOId: string) {
    return await this.documentGDBService.documentGHasUser(dOId, uOId)
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userDBService.create(createUserDto)
    return newUser
  }

  async createSingleChatRoom(uOId: string, tUOId: string) {
    const chatRoom = await this.chatRoomDBService.createChatRoom([uOId, tUOId])
    if (chatRoom) {
      const cOId = chatRoom._id.toString()
      this.userDBService.setUserSingleChatRoom(uOId, tUOId, cOId)
      this.userDBService.setUserSingleChatRoom(tUOId, uOId, cOId)
    }

    return chatRoom
  }

  async createDocumentG(uOId: string) {
    const documentG = await this.documentGDBService.createDocumentG([uOId])
    if (documentG) {
      const dOId = documentG._id.toString()
      const ret = await this.userDBService.addDocumentG(uOId, dOId)
      if (ret) {
        return dOId
      } // BLANK LINE COMMENT:
      else {
        return null
      }
    } // BLANK LINE COMMENT:
    else {
      return null
    }
  }

  async findChatRooms(uOId: string) {
    const user = await this.userDBService.findOneByObjectId(uOId)
    if (!user) {
      return null
    }
    const singleChatRooms = user.singleChatRooms

    const ret: RowSingleChatRoomType[] = []
    const tUOIds = Object.keys(singleChatRooms)

    for (let tUOId of tUOIds) {
      const cOId = singleChatRooms[tUOId]
      const tUser = await this.userDBService.findOneByObjectId(tUOId)
      ret.push({
        cOId: cOId,
        tUOId: tUOId,
        tUId: tUser.id,
        unreadChat: user.unReadChats[cOId]
      })
    }

    return ret
  }

  async findDocumentGs(uOId: string) {
    const user = await this.userDBService.findOneByObjectId(uOId)
    if (!user) {
      return null
    }

    const dOIds = Object.keys(user.documentGs)
    const ret: RowDocumentGType[] = []

    for (let dOId of dOIds) {
      const documentG = await this.documentGDBService.findOneByObjectId(dOId)
      ret.push({
        dOId: dOId,
        title: documentG.title
      })
    }

    return ret
  }

  /**
   * @param id : Base user id
   * @param idOrEmail : Target user id
   */
  async findSingleChatRoom(id: string, idOrEmail: string) {
    const chatRoomOId = await this.userDBService.findUsersChatRoom(id, idOrEmail)
    return chatRoomOId
  }

  async findUserByEmail(email: string) {
    const user = await this.userDBService.findOneByEmail(email)
    return user
  }

  async findUserById(id: string) {
    const user = await this.userDBService.findOneById(id)
    return user
  }

  async findUserByIdOrEmail(idOrEmail: string) {
    const user = await this.userDBService.findOneByIdOrEmail(idOrEmail)
    return user
  }

  /**
   * chatBlocks 만 가져온다.
   * 안 읽은 메시지 개수는 다른 함수에서 가져오는게 맞다.
   * 왜냐하면 chatRooms 에서도 쓰여야 한다.
   */
  async getChatBlocks(cOId: string) {
    return await this.chatRoomDBService.getChatBlocks(cOId)
  }
  async getChatRoomUsers(cOId: string) {
    return await this.chatRoomDBService.getChatRoomUsers(cOId)
  }
  async getDocumentG(dOId: string) {
    return await this.documentGDBService.getDocumentG(dOId)
  }
  async getDocumentGUsers(dOId: string) {
    const uOIdObj = await this.documentGDBService.getDocumentGUsers(dOId)
    const uOIds = Object.keys(uOIdObj)
    return uOIds
  }
  async getUserIdEmail(uOId: string) {
    const ret = await this.userDBService.getUserIdEmail(uOId)
    return ret
  }

  async setUnreadChat(uOId: string, cOId: string, newCnt: number) {
    return await this.userDBService.setUnreadChat(uOId, cOId, newCnt)
  }

  async increaseUnreadChat(uOId: string, cOId: string) {
    const ret = await this.userDBService.increaseUnreadChat(uOId, cOId)
    return ret
  }
  async increaseUnreadChatDocument(uOId: string, dOId: string) {
    const ret = await this.userDBService.increaseUnreadChatDocument(uOId, dOId)
    return ret
  }
  /**
   */
  async insertChatBlock(cOId: string, chatBlock: ChatBlockType) {
    const ret = await this.chatRoomDBService.insertChatBlock(cOId, chatBlock)
    return ret
  }
  async insertChatBlockToDocG(dOId: string, chatBlock: ChatBlockType) {
    const ret = await this.documentGDBService.insertChatBlock(dOId, chatBlock)
    return ret
  }
  // BLANK LINE COMMENT:
}
