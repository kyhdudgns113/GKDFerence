import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, ObjectId} from 'mongoose'
import {ChatRoom} from './chatroom.entity'

@Injectable()
export class ChatRoomService {
  constructor(@InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>) {}

  async createChatRoom(uOIds: string[]) {
    const chatRoomUsers = {}
    uOIds.forEach(uOId => {
      chatRoomUsers[uOId] = true
    })
    const newChatRoom = new this.chatRoomModel(chatRoomUsers)
    newChatRoom.createdDt = new Date()

    return newChatRoom.save()
  }

  // BLANK LINE COMMENT
}
