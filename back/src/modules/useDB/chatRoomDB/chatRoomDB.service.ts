import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {ChatBlock, ChatRoom} from './chatRoomDB.entity'
type ChatBlockType = {
  idx?: number
  id: string
  uOId: string
  date?: Date
  content: string
}

@Injectable()
export class ChatRoomDBService {
  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
    @InjectModel(ChatBlock.name) private chatBlockModel: Model<ChatBlock>
  ) {}

  async createChatRoom(uOIdArray: string[]) {
    const uOIds = {}
    uOIdArray.forEach(uOId => {
      uOIds[uOId] = true
    })

    const newChatRoom = new this.chatRoomModel({
      uOIds: uOIds,
      createdDt: new Date()
    })

    return newChatRoom.save()
  }

  async chatRoomHasUser(cOId: string, uOId: string) {
    const chatRoom = await this.findOneByOId(cOId)
    if (!chatRoom || !chatRoom.uOIds[uOId]) {
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

  async getChatRoomUsers(cOId: string) {
    const chatRoom = await this.findOneByOId(cOId)
    if (!chatRoom) {
      return null
    }
    return chatRoom.uOIds
  }

  async insertChatBlock(cOId: string, chatBlock: ChatBlockType) {
    const chatRoom = await this.findOneByOId(cOId)
    if (!chatRoom) {
      return null
    }
    const newIdx = chatRoom.chatBlocks.length
    const newDate = new Date()
    chatBlock.idx = newIdx
    chatBlock.date = newDate

    const newChatBlock = new this.chatBlockModel(chatBlock)
    chatRoom.chatBlocks.push(newChatBlock)
    await chatRoom.save()
    return chatRoom.uOIds
  }

  // BLANK LINE COMMENT:
}
