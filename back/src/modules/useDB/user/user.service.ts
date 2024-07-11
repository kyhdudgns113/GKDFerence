import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, ObjectId} from 'mongoose'
import {User} from './entities'
import {CreateUserDto, UpdateUserDto} from './dto'

@Injectable()
export class UserService {
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

  async findOneByObjectId(_id: ObjectId): Promise<User> {
    const result = await this.userModel.findOne({_id: _id})
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

  blankLineFunction() {
    //
  }
}
