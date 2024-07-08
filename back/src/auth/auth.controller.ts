import {Controller, Get, Post, Body, Patch, Param, Delete, Headers} from '@nestjs/common'
import {AuthService} from './auth.service'
import {AuthBodyType, AuthObjectType} from 'src/common'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // AREA2 : Post
  @Post('/signup')
  async signUp(@Body() authBody: AuthBodyType) {
    const {ok, body, errors} = await this.authService.signup(authBody)
    return {ok, body, errors} as AuthObjectType
  }

  @Post('/login')
  async login(@Body() authBody: AuthBodyType) {
    const ret = await this.authService.login(authBody)
    return ret
  }

  // AREA2 : Get
  @Get('/checkToken')
  async checkToken(@Headers() headers) {
    if (!headers || !headers.authorization) {
      const errors: {[key: string]: string} = {}
      errors['jwt'] = 'No headers'
      return {ok: false, body: {}, errors: errors}
    }
    const jwt = headers.authorization.split(' ')[1]
    const ret = await this.authService.checkToken(jwt)
    return ret
  }

  @Get('/refreshToken')
  async refreshToken(@Headers() headers) {
    if (!headers || !headers.authorization) {
      const errors: {[key: string]: string} = {}
      errors['jwt'] = 'No headers'
      return {ok: false, body: {}, errors: errors}
    }
    const jwt = headers.authorization.split(' ')[1]
    const ret = await this.authService.refreshToken(jwt)
    return ret
  }
}
