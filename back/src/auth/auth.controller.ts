import {Controller, Get, Post, Body, Patch, Param, Delete, Headers} from '@nestjs/common'
import {AuthService} from './auth.service'
import {AuthBodyType, AuthObjectType} from 'src/common'
import {getJwtFromHeader} from 'src/util'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // AREA2 : Post
  @Post('/signup')
  async signUp(@Body() authBody: AuthBodyType) {
    console.log('/auth/signup called with ', authBody.id)
    return await this.authService.signup(authBody)
  }
  @Post('/login')
  async login(@Body() authBody: AuthBodyType) {
    return await this.authService.login(authBody)
  }

  // AREA2 : Get
  @Get('/checkToken')
  async checkToken(@Headers() headers) {
    const jwt = getJwtFromHeader(headers) ?? ''
    return await this.authService.checkToken(jwt)
  }
  @Get('/refreshToken')
  async refreshToken(@Headers() headers) {
    const jwt = getJwtFromHeader(headers) ?? ''
    return await this.authService.refreshToken(jwt)
  }
}
