import {Injectable} from '@nestjs/common'

import {UserService} from 'src/modules/useDB/user/user.service'
import {CreateUserDto} from 'src/modules/useDB/user/dto'
import {ChatRoomService} from './chatroom/chatroom.service'
import {RowSingleChatRoomType} from 'src/common'

@Injectable()
export class UseDBService {
  constructor(
    private userService: UserService,
    private chatRoomService: ChatRoomService
  ) {}

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
   * @param id : Base user id
   * @param idOrEmail : Target user id
   */
  async findSingleChatRoom(id: string, idOrEmail: string) {
    const chatRoomOId = await this.userService.findUsersChatRoom(id, idOrEmail)
    return chatRoomOId
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

  emptyFunction() {
    // this function is for blank line
  }
}
