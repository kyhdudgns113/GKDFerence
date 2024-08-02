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

/**
 * // NOTE: 여기는 예외적으로 jwtService 를 service 내에서 사용한다.
 * // NOTE: jwt 토큰을 만드는 작업을 해야 한다.
 * // NOTE: 또한 auth 모듈 내부에 속해있는 모듈이 없기도 하다.
 */
@Controller('auth')
export class AuthController {
  private logger: Logger = new Logger('AuthController')
  constructor(private readonly authService: AuthService) {}

  // AREA2: Post
  @Post('/signup')
  async signUp(@Body() authBody: AuthBodyType) {
    this.logger.log(`signup(${authBody.id}): requested`)
    const ret = await this.authService.signup(authBody)
    this.logger.log(`signup(${authBody.id}): ${ret.ok}`)
    return ret
  }
  @Post('/login')
  async login(@Body() authBody: AuthBodyType) {
    this.logger.log(`login(${authBody.id}): requested`)
    const ret = await this.authService.login(authBody)
    this.logger.log(`login(${authBody.id}): ${ret.ok}, ${Object.keys(ret.errors)}`)
    return ret
  }

  // AREA2: Get
  @Get('/checkToken')
  async checkToken(@Headers() headers) {
    const jwt = getJwtFromHeader(headers) ?? ''
    return await this.authService.checkToken(jwt)
  }
  @Get('/refreshTokenPhase1')
  async refreshTokenPhase1(@Headers() headers) {
    const jwtFromClient = getJwtFromHeader(headers) ?? ''
    return await this.authService.refreshTokenPhase1(jwtFromClient)
  }
  @Get('/refreshTokenPhase2')
  async refreshTokenPhase2(@Headers() headers) {
    const jwtFromClient = getJwtFromHeader(headers) ?? ''
    return await this.authService.refreshTokenPhase2(jwtFromClient)
  }
}
