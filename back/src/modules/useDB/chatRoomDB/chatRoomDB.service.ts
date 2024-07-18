import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {ChatRoom} from './chatRoomDB.entity'

@Injectable()
export class ChatRoomDBService {
  constructor(@InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>) {}

  async createChatRoom(uOIds: string[]) {
    const users = {}
    uOIds.forEach(uOId => {
      users[uOId] = true
    })

    const newChatRoom = new this.chatRoomModel({
      users: users,
      createdDt: new Date()
    })

    return newChatRoom.save()
  }

  async chatRoomHasUser(cOId: string, uOId: string) {
    const chatRoom = await this.findOneByOId(cOId)
    if (!chatRoom || !chatRoom.users[uOId]) {
      return false
    }
    return true
  }

  async findOneByOId(cOId: string) {
    const chatRoomOId = new Types.ObjectId(cOId)
    return await this.chatRoomModel.findOne({_id: chatRoomOId})
  }

  async getChatBlocks(cOId: string) {
    const chatRoom = await this.findOneByOId(cOId)
    if (!chatRoom) {
      return null
    }
    const chatBlocks = chatRoom.chatBlocks
    return chatBlocks
  }

  async getChatRoomUserList(cOId: string) {
    const chatRoom = await this.findOneByOId(cOId)
    if (!chatRoom) {
      return null
    }
    return chatRoom.users
  }

  // BLANK LINE COMMENT
}
