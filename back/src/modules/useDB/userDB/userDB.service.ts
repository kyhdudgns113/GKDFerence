import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {CreateUserDto} from './dto'
import {User} from './userDB.entity'

@Injectable()
export class UserDBService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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

  async findOneByObjectId(_id: string): Promise<User> {
    const oid = new Types.ObjectId(_id)
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

    return user.singleChatList && user.singleChatList[targetUser._id.toString()]
  }

  async setUserSingleChatRoom(uOId: string, tUOId: string, chatOId: string) {
    const _id = new Types.ObjectId(uOId)
    const ret = await this.userModel.updateOne(
      {_id: _id},
      {$set: {[`singleChatList.${tUOId}`]: chatOId}}
    )
    return ret
  }

  async idToOid(id: string) {
    const user = await this.findOneById(id)
    if (user) {
      return user._id.toString()
    } else {
      return ''
    }
  }

  async idOrEmailToOid(idOrEmail: string) {
    const user = await this.findOneByIdOrEmail(idOrEmail)
    if (user) {
      return user._id.toString()
    } else {
      return ''
    }
  }

  // BLANK LINE COMMENT
}
