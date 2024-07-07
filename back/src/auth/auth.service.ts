import {Injectable} from '@nestjs/common'
import {ObjectId} from 'mongoose'
import * as bcrypt from 'bcrypt'
import {JwtService} from '@nestjs/jwt'

import {CreateUserDto, UserService} from '../user'
import {gkdSaltOrRounds} from '../server_secret'
import {JwtPayload} from '../jwt'
import {AuthBodyType} from '../common'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  // TODO: 그냥 나머지 다 구현하면 됨.
  async signup(userDto: CreateUserDto) {
    const errors: {[key: string]: string} = {}
    let ok: boolean = true
    let body: AuthBodyType = {}

    const userById = await this.userService.findOneById(userDto.id)
    const userByEmail = await this.userService.findOneByEmail(userDto.email)

    if (userById) {
      errors['id'] = 'ID가 중복입니다.'
      ok = false
    }
    if (userByEmail) {
      errors['email'] = 'EMAIL이 중복입니다.'
      ok = false
    }
    const hashedPassword = bcrypt.hashSync(userDto.password, gkdSaltOrRounds)

    if (ok) {
      try {
        const user = await this.userService.create({
          ...userDto,
          password: hashedPassword
        })

        const jwtPayload: JwtPayload = {id: user.id, email: user.email}
        const jwt = this.jwtService.sign(jwtPayload)

        ok = true
        body.id = user.id
        body.email = user.email
        body._id = user._id as string
        body.jwt = jwt
      } catch (error) {
        ok = false
        errors['other'] = error
        body = null
      }
    }

    return {ok, body, errors}
  }

  findOneById(id: string) {
    return id
  }

  findOneByObjectId(_id: ObjectId) {
    return 'yes'
  }

  findOneByEmail(email: string) {
    return email
  }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  remove(id: number) {
    return `This action removes a #${id} auth`
  }
}
