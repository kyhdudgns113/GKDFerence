import {Injectable} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import {JwtService} from '@nestjs/jwt'

import {gkdJwtSecret, gkdSaltOrRounds} from '../server_secret'
import {AuthBodyType, AuthObjectType, JwtPayload} from '../common'
import {UserService} from 'src/user/user.service'
import {CreateUserDto} from 'src/user/dto'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signup(authBody: AuthBodyType) {
    const errors: {[key: string]: string} = {}
    let ok: boolean = true
    let body: AuthBodyType = {}

    const userById = await this.userService.findOneById(authBody.id)
    const userByEmail = await this.userService.findOneByEmail(authBody.email)

    if (userById) {
      errors['id'] = 'ID가 중복입니다.'
      ok = false
    }
    if (userByEmail) {
      errors['email'] = 'EMAIL이 중복입니다.'
      ok = false
    }
    const hashedPassword = bcrypt.hashSync(authBody.password, gkdSaltOrRounds)

    if (ok) {
      try {
        const userDto: CreateUserDto = {
          id: authBody.id,
          email: authBody.email,
          hashedPassword: hashedPassword
        }
        const user = await this.userService.create({
          ...userDto,
          hashedPassword: hashedPassword
        })

        const jwtPayload: JwtPayload = {id: user.id, email: user.email}
        const jwt = this.jwtService.sign(jwtPayload)

        ok = true
        body.id = user.id
        body.email = user.email
        body.jwt = jwt
      } catch (error) {
        ok = false
        errors['other'] = error
        body = null
      }
    }

    const sendObject: AuthObjectType = {ok, body, errors}

    return sendObject
  }

  async login(authBody: AuthBodyType) {
    const authObject: AuthObjectType = {
      ok: true,
      body: {},
      errors: {}
    }

    //  Check is input validate
    const {id, password} = authBody
    if (!id || !password) {
      authObject.ok = false
      authObject.errors['id'] = id ? '' : 'ID 가 공란입니다.'
      authObject.errors['password'] = password ? '' : 'PW 가 공란입니다.'
      return authObject
    }

    // Check is user exist
    let user = await this.userService.findOneById(id)
    if (!user) {
      user = await this.userService.findOneByEmail(id)
      if (!user) {
        authObject.ok = false
        authObject.errors['id'] = '존재하지 않는 ID 입니다.'
        return authObject
      }
    }

    // Check password
    const isPwSame = await bcrypt.compare(password, user.hashedPassword)
    if (!isPwSame) {
      authObject.ok = false
      authObject.errors['password'] = '비밀번호가 틀립니다.'
      return authObject
    }

    /** For forcing type, jwtPayload should be declared as const variable */
    const jwtPayload: JwtPayload = {
      id: user.id,
      email: user.email
    }
    const jwt = this.jwtService.sign(jwtPayload)
    authObject.body.id = authBody.id
    authObject.body.jwt = jwt

    return authObject
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

    const isJwt = this.jwtService.verify(jwt)
    const sendObject: AuthObjectType = {
      ok: Boolean(isJwt),
      body: isJwt ? {jwt: jwt} : {},
      errors: isJwt ? {} : {jwt: 'JWT Invalid'}
    }

    return sendObject
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

    const isJwt = this.jwtService.verify(jwt)
    if (!isJwt) {
      const sendObject: AuthObjectType = {
        ok: false,
        body: {},
        errors: {jwt: 'JWT Invalid'}
      }
      return sendObject
    }

    /** For forcing type, jwtPayload should be declared as const variable */
    const jwtPayload: JwtPayload = {
      id: isJwt.id,
      email: isJwt.email
    }
    const newJwt = this.jwtService.sign(jwtPayload)
    const sendObject: AuthObjectType = {
      ok: Boolean(newJwt),
      body: {jwt: newJwt},
      errors: newJwt ? {} : {jwt: 'jwt regenerate error'}
    }
    return sendObject
  }

  emptyFunction() {
    // this function is for blank line
  }
}
