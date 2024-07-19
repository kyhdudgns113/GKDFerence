import {Injectable} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {ObjectId} from 'mongoose'

import {
  AuthBodyType,
  AuthObjectType,
  gkdJwtSignOption,
  gkdSaltOrRounds,
  JwtPayload
} from 'src/common'

import * as bcrypt from 'bcrypt'
import {UseDBService} from '../useDB/useDB.service'
import {CreateUserDto} from '../useDB/userDB/dto'

/**
 * // NOTE: 여기는 예외적으로 jwtService 를 service 내에서 사용한다.
 * // NOTE: jwt 토큰을 만드는 작업을 해야 한다.
 * // NOTE: 또한 auth 모듈 내부에 속해있는 모듈이 없기도 하다.
 */
@Injectable()
export class AuthService {
  constructor(
    private useDBService: UseDBService,
    private jwtService: JwtService
  ) {}

  async signup(authBody: AuthBodyType) {
    const ret: AuthObjectType = {
      ok: false,
      body: {},
      errors: {}
    }

    //  Find User: ID
    let existUser = await this.useDBService.findUserById(authBody.id)
    if (existUser) {
      ret.errors['id'] = 'ID already exist'
      return ret
    }

    //  Find User: Email
    existUser = await this.useDBService.findUserByEmail(authBody.email)
    if (existUser) {
      ret.errors['email'] = 'Email already exist'
      return ret
    }

    const hashedPassword = bcrypt.hashSync(authBody.password, gkdSaltOrRounds)

    const newUser = await this.useDBService.createUser({
      id: authBody.id,
      email: authBody.email,
      hashedPassword
    } as CreateUserDto)

    if (!newUser) {
      ret.errors['create'] = 'User Create Error'
      return ret
    }

    const jwtPayload: JwtPayload = {
      id: newUser.id,
      uOId: newUser._id.toString(),
      email: newUser.email
    }
    const jwt = await this.jwtService.signAsync(jwtPayload, gkdJwtSignOption)

    ret.ok = true
    ret.body = {
      id: newUser.id,
      uOId: newUser._id.toString(),
      email: newUser.email,
      jwt: jwt
    }

    return ret
  }

  async login(authBody: AuthBodyType) {
    const ret: AuthObjectType = {
      ok: false,
      body: {},
      errors: {}
    }

    let user = await this.useDBService.findUserByIdOrEmail(authBody.id)

    if (user) {
      const isPwSame = bcrypt.compareSync(authBody.password, user.hashedPassword)

      if (!isPwSame) {
        ret.errors['password'] = 'Wrong Password'
        return ret
      }

      const jwtPayload: JwtPayload = {
        id: user.id,
        uOId: user._id.toString(),
        email: user.email
      }
      const jwt = await this.jwtService.signAsync(jwtPayload, gkdJwtSignOption)
      ret.ok = true
      ret.body.id = user.id
      ret.body.email = user.email
      ret.body.uOId = user._id.toString()
      ret.body.jwt = jwt
    } else {
      ret.errors['idOrEmail'] = "User isn't exist"
    }

    return ret
  }

  async checkToken(jwt: string) {
    if (!jwt) {
      const sendObject: AuthObjectType = {
        ok: false,
        body: {},
        errors: {jwt: 'No header is sended'}
      }
      return sendObject
    }
    try {
      this.jwtService.verify(jwt)
      const sendObject: AuthObjectType = {
        ok: true,
        body: {jwt: jwt},
        errors: {}
      }
      return sendObject
    } catch (err) {
      const sendObject: AuthObjectType = {
        ok: false,
        body: {},
        errors: {jwt: 'JWT Invalid'}
      }
      return sendObject
    }
  }

  async refreshToken(jwt: string) {
    if (!jwt) {
      const sendObject: AuthObjectType = {
        ok: false,
        body: {},
        errors: {jwt: 'No header is sended'}
      }
      return sendObject
    }

    try {
      const isJwt = this.jwtService.verify(jwt)
      /** For forcing type, jwtPayload should be declared as const variable */
      const jwtPayload: JwtPayload = {
        id: isJwt.id,
        uOId: isJwt.uOId,
        email: isJwt.email
      }
      const newJwt = this.jwtService.sign(jwtPayload)
      const sendObject: AuthObjectType = {
        ok: Boolean(newJwt),
        body: {jwt: newJwt},
        errors: newJwt ? {} : {jwt: 'jwt regenerate error'}
      }
      return sendObject
    } catch (err) {
      const sendObject: AuthObjectType = {
        ok: false,
        body: {},
        errors: {jwt: 'JWT Invalid'}
      }
      return sendObject
    }
  }

  // BLANK LINE COMMENT:
}
