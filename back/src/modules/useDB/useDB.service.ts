import {Injectable} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'

import {UserService} from 'src/modules/useDB/user/user.service'
import {CreateUserDto} from 'src/modules/useDB/user/dto'
import {ChatRoomService} from './chatroom/chatroom.service'

@Injectable()
export class UseDBService {
  constructor(
    private userService: UserService,
    private chatRoomService: ChatRoomService,
    private jwtService: JwtService
  ) {}

  async findUserById(id: string) {
    const user = await this.userService.findOneById(id)
    return user
  }

  async findUserByEmail(email: string) {
    const user = await this.userService.findOneByEmail(email)
    return user
  }

  async findUserByIdOrEmail(idOrEmail: string) {
    const user = await this.userService.findOneByIdOrEmail(idOrEmail)
    return user
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userService.create(createUserDto)
    return newUser
  }

  /**
   * @param id : Base user id
   * @param idOrEmail : Target user id
   */
  async findSingleChatRoom(id: string, idOrEmail: string) {
    const chatRoomOId = await this.userService.findUsersChatRoom(id, idOrEmail)

    return chatRoomOId
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
