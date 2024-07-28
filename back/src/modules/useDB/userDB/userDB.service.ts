import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {CreateUserDto} from './dto'
import {User} from './userDB.entity'

@Injectable()
export class UserDBService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async addDocumentG(uOId: string, dOId: string) {
    const _id = new Types.ObjectId(uOId)
    const ret = this.userModel.updateOne(
      {_id: _id},
      {$set: {[`documentGs.${dOId}`]: true}}
    )

    return ret
  }

  create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto)
    createdUser.createdDt = new Date()
    return createdUser.save()
  }

  async findAll(): Promise<User[]> {
    const result = await this.userModel.find().exec()
    return result
  }

  async findOneById(id: string): Promise<User> {
    const result = await this.userModel.findOne({id: id})
    return result
  }

  async findOneByEmail(email: string): Promise<User> {
    const result = await this.userModel.findOne({email: email})
    return result
  }

  async findOneByIdOrEmail(idOrEmail: string): Promise<User> {
    let result = await this.userModel.findOne({id: idOrEmail})

    if (!result) {
      result = await this.userModel.findOne({email: idOrEmail})
    }

    return result
  }

  async findOneByObjectId(uOId: string): Promise<User> {
    const oid = new Types.ObjectId(uOId)
    const result = await this.userModel.findOne({_id: oid})

    return result
  }

  async findUser(idOrEmail: string) {
    let user = await this.userModel.findOne({id: idOrEmail})

    if (!user) {
      user = await this.userModel.findOne({email: idOrEmail})
      if (!user) {
        return {
          ok: false,
          body: {},
          errors: {idOrEmail: '유저를 찾을 수 없어요'}
        }
      }
    }

    return {
      ok: true,
      body: {userName: user.id},
      errors: {}
    }
  }

  /**
   * @param id : 어떤 유저의 채팅방을 찾을건가?
   * @param idOrEmail : 어떤 유저와의 채팅방을 찾을건가?
   * @returns : 채팅방의 ObjectId to string
   */
  async findUsersChatRoom(id: string, idOrEmail: string) {
    const user = await this.findOneById(id)
    const targetUser = await this.findOneByIdOrEmail(idOrEmail)

    if (!user || !targetUser) {
      return null
    }

    return user.singleChatRooms && user.singleChatRooms[targetUser._id.toString()]
  }

  /**
   * @returns 업데이트 된 unReadChats[cOId] 값. socket.gateway.chat 에서 쓴다
   * - socketP만 연결된 uOId 가 안 읽은 cOId 개수를 socketP 를 통해 전달하는 용도
   */
  async increaseUnreadChat(uOId: string, cOId: string) {
    const _id = new Types.ObjectId(uOId)
    await this.userModel.updateOne(
      {_id: _id},
      {
        $inc: {
          [`unReadChats.${cOId}`]: 1
        }
      }
    )

    const user = await this.findOneByObjectId(uOId)
    return user.unReadChats[cOId]
  }

  async setUnreadChat(uOId: string, cOId: string, newCnt: number) {
    const _id = new Types.ObjectId(uOId)
    const ret = await this.userModel.updateOne(
      {_id: _id},
      {
        $set: {
          [`unReadChats.${cOId}`]: newCnt
        }
      }
    )

    return ret
  }

  async setUserSingleChatRoom(uOId: string, tUOId: string, cOId: string) {
    const _id = new Types.ObjectId(uOId)
    const ret = await this.userModel.updateOne(
      {_id: _id},
      {
        $set: {
          [`singleChatRooms.${tUOId}`]: cOId,
          [`unReadChats.${cOId}`]: 0
        }
      }
    )
    return ret
  }

  // BLANK LINE COMMENT
}
