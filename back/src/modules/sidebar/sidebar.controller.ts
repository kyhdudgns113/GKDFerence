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
import {SidebarService} from './sidebar.service'
import {getJwtFromHeader} from 'src/util'
import {JwtPayload, SidebarBodyType} from 'src/common'
import {JwtService} from '@nestjs/jwt'

// NOTE: JWT 검증은 controller 에서 해야한다.
// NOTE: JWT 검증은 controller 에서 해야한다.
// NOTE: JWT 검증은 controller 에서 해야한다.
@Controller('sidebar')
export class SidebarController {
  private logger: Logger = new Logger('SidebarController')
  constructor(
    private readonly sidebarService: SidebarService,
    private readonly jwtService: JwtService
  ) {}

  // AREA2 : Post
  @Post('/createSingleChatRoom/:idOrEmail')
  async createChatRoom(
    @Body() body: SidebarBodyType,
    @Param('idOrEmail') idOrEmail: string
  ) {
    const jwt = body.jwt || ''
    try {
      await this.jwtService.verifyAsync(jwt)
    } catch (error) {
      return {
        ok: false,
        body: {},
        errors: {jwt: 'Jwt invalid in createSingleChatRoom'}
      }
    }
    const ret = await this.sidebarService.createSingleChatRoom(body, idOrEmail)
    return ret
  }

  // AREA2 : Get
  /**
   * It is used in create chatroom modal
   */
  @Get('/findUser/:idOrEmail')
  async findUser(@Headers() headers: any, @Param('idOrEmail') idOrEmail: string) {
    const jwt = getJwtFromHeader(headers) ?? ''
    try {
      await this.jwtService.verifyAsync(jwt)
    } catch (error) {
      return {
        ok: false,
        body: {},
        errors: {jwt: 'Jwt invalid'}
      }
    }

    const ret = await this.sidebarService.findUserIdOrEmail(idOrEmail)
    return ret
  }

  @Get('/chatRoom/getChatBlocks/:cOId')
  async getChatBlocks(@Headers() headers: any, @Param('cOId') cOId: string) {
    const jwt = getJwtFromHeader(headers) ?? ''
    let returnedJwt: JwtPayload
    try {
      returnedJwt = await this.jwtService.verifyAsync(jwt)
    } catch (error) {
      return {
        ok: false,
        body: {},
        errors: {jwt: 'Jwt invalid'}
      }
    }
    const uOId = returnedJwt.uOId
    const ret = this.sidebarService.getChatBlocks(uOId, cOId)
    return ret
  }

  @Get('/getChatList/:uOId')
  async getChatList(@Headers() headers: any, @Param('uOId') uOId: string) {
    const jwt = getJwtFromHeader(headers) ?? ''
    try {
      await this.jwtService.verifyAsync(jwt)
    } catch (error) {
      return {
        ok: false,
        body: {},
        errors: {jwt: 'Jwt invalid'}
      }
    }

    const ret = this.sidebarService.getUserChatRoomList(uOId)
    return ret
  }
  // BLANK LINE COMMENT:
}
