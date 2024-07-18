import {Injectable} from '@nestjs/common'

import {CreateUserDto} from 'src/modules/useDB/userDB/dto'
import {ChatRoomDBService} from './chatRoomDB/chatRoomDB.service'
import {RowSingleChatRoomType} from 'src/common'
import {UserDBService} from './userDB/userDB.service'

/**
 * // NOTE: DON'T RETURN {ok, body, errors} type
 */
@Injectable()
export class UseDBService {
  constructor(
    private userService: UserDBService,
    private chatRoomService: ChatRoomDBService
  ) {}

  async ChatRoomHasUser(cOId: string, uOId: string) {
    return await this.chatRoomService.chatRoomHasUser(cOId, uOId)
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userService.create(createUserDto)
    return newUser
  }

  async createSingleChatRoom(uOId: string, tUOId: string) {
    const chatRoom = await this.chatRoomService.createChatRoom([uOId, tUOId])
    if (chatRoom) {
      const chatRoomOId = chatRoom._id.toString()
      this.userService.setUserSingleChatRoom(uOId, tUOId, chatRoomOId)
      this.userService.setUserSingleChatRoom(tUOId, uOId, chatRoomOId)
    }

    return chatRoom
  }

  async findChatRoomList(uOId: string) {
    const user = await this.userService.findOneByObjectId(uOId)
    if (!user) {
      return null
    }
    const chatKeyVal = user.singleChatList

    const ret: RowSingleChatRoomType[] = []
    const keys = Object.keys(chatKeyVal)

    for (let targetUOId of keys) {
      const tUser = await this.userService.findOneByObjectId(targetUOId)
      ret.push({
        chatRoomOId: chatKeyVal[targetUOId],
        targetUOId: targetUOId,
        targetId: tUser.id
      })
    }

    return ret
  }

  /**
   * @param id : Base user id
   * @param idOrEmail : Target user id
   */
  async findSingleChatRoom(id: string, idOrEmail: string) {
    const chatRoomOId = await this.userService.findUsersChatRoom(id, idOrEmail)
    return chatRoomOId
  }

  async findUserByEmail(email: string) {
    const user = await this.userService.findOneByEmail(email)
    return user
  }

  async findUserById(id: string) {
    const user = await this.userService.findOneById(id)
    return user
  }

  async findUserByIdOrEmail(idOrEmail: string) {
    const user = await this.userService.findOneByIdOrEmail(idOrEmail)
    return user
  }

  /**
   * chatBlocks 만 가져온다.
   * 안 읽은 메시지 개수는 다른 함수에서 가져오는게 맞다.
   * 왜냐하면 chattingList 에서도 쓰여야 한다.
   */
  async getChatBlocks(cOId: string) {
    return await this.chatRoomService.getChatBlocks(cOId)
  }

  async getChatRoomUserList(cOId: string) {
    return await this.chatRoomService.getChatRoomUserList(cOId)
  }

  emptyFunction() {
    // this function is for blank line
  }
}
