import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, ObjectId} from 'mongoose'

import {CreateUserDto, UpdateUserDto, User} from '../user'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto)
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

  async findOneByObjectId(_id: ObjectId): Promise<User> {
    const result = await this.userModel.findOne({_id: _id})
    return result
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
