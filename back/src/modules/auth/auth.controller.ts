import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Logger
} from '@nestjs/common'
import {AuthService} from './auth.service'
import {AuthBodyType} from 'src/common'
import {getJwtFromHeader} from 'src/util'

@Controller('auth')
export class AuthController {
  private logger: Logger = new Logger('AuthController')
  constructor(private readonly authService: AuthService) {}

  // AREA2 : Post
  @Post('/signup')
  async signUp(@Body() authBody: AuthBodyType) {
    console.log(`signup(${authBody.id}): requested`)
    const ret = await this.authService.signup(authBody)
    console.log(`signup(${authBody.id}): ${ret.ok}`)
    return ret
  }
  @Post('/login')
  async login(@Body() authBody: AuthBodyType) {
    this.logger.log(`login(${authBody.id}): requested`)
    const ret = await this.authService.login(authBody)
    this.logger.log(`login(${authBody.id}): ${ret.ok}, ${Object.keys(ret.errors)}`)
    return ret
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
