import {Injectable} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'

import {UserService} from 'src/modules/useDB/user/user.service'
import {CreateUserDto} from 'src/modules/useDB/user/dto'

@Injectable()
export class UseDBService {
  constructor(
    private userService: UserService,
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

  emptyFunction() {
    // this function is for blank line
  }
}
