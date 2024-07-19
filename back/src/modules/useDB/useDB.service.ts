import {Injectable} from '@nestjs/common'

import {CreateUserDto} from 'src/modules/useDB/userDB/dto'
import {ChatRoomDBService} from './chatRoomDB/chatRoomDB.service'
import {ChatBlockType, RowSingleChatRoomType} from 'src/common'
import {UserDBService} from './userDB/userDB.service'

/**
 * // NOTE: DON'T RETURN {ok, body, errors} type
 */
@Injectable()
export class UseDBService {
  constructor(
    private userDBService: UserDBService,
    private chatRoomDBService: ChatRoomDBService
  ) {}

  async ChatRoomHasUser(cOId: string, uOId: string) {
    return await this.chatRoomDBService.chatRoomHasUser(cOId, uOId)
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userDBService.create(createUserDto)
    return newUser
  }

  async createSingleChatRoom(uOId: string, tUOId: string) {
    const chatRoom = await this.chatRoomDBService.createChatRoom([uOId, tUOId])
    if (chatRoom) {
      const chatRoomOId = chatRoom._id.toString()
      this.userDBService.setUserSingleChatRoom(uOId, tUOId, chatRoomOId)
      this.userDBService.setUserSingleChatRoom(tUOId, uOId, chatRoomOId)
    }

    return chatRoom
  }

  async findChatRoomList(uOId: string) {
    const user = await this.userDBService.findOneByObjectId(uOId)
    if (!user) {
      return null
    }
    const chatKeyVal = user.singleChatRooms

    const ret: RowSingleChatRoomType[] = []
    const keys = Object.keys(chatKeyVal)

    for (let tOId of keys) {
      const tUser = await this.userDBService.findOneByObjectId(tOId)
      ret.push({
        cOId: chatKeyVal[tOId],
        tUOId: tOId,
        tUId: tUser.id
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
   * 왜냐하면 chattingList 에서도 쓰여야 한다.
   */
  async getChatBlocks(cOId: string) {
    return await this.chatRoomDBService.getChatBlocks(cOId)
  }

  async getChatRoomUserList(cOId: string) {
    return await this.chatRoomDBService.getChatRoomUserList(cOId)
  }

  async setUnreadCnt(uOId: string, cOId: string, newCnt: number) {
    return await this.userDBService.setUnreadCnt(uOId, cOId, newCnt)
  }

  async increaseUnreadCnt(uOId: string, cOId: string) {
    const ret = await this.userDBService.increaseUnreadCnt(uOId, cOId)
    return ret
  }

  /**
   */
  async insertChatBlock(cOId: string, chatBlock: ChatBlockType) {
    const ret = await this.chatRoomDBService.insertChatBlock(cOId, chatBlock)
    return ret
  }
  // BLANK LINE COMMENT:
}
