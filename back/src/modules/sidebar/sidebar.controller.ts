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
import {gkdJwtSignOption, JwtPayload, SidebarBodyType} from 'src/common'
import {JwtService} from '@nestjs/jwt'
import {LockService} from '../lock/lock.service'
import {GkdJwtService} from '../gkdJwt/gkdJwt.service'

// NOTE: JWT 검증은 controller 에서 해야한다.
// NOTE: JWT 검증은 controller 에서 해야한다.
// NOTE: JWT 검증은 controller 에서 해야한다.
@Controller('sidebar')
export class SidebarController {
  private logger: Logger = new Logger('SidebarController')
  constructor(
    private readonly gkdJwtService: GkdJwtService,
    private readonly lockService: LockService,
    private readonly sidebarService: SidebarService
  ) {}

  // AREA2 : Post
  @Post('/createSingleChatRoom/:idOrEmail')
  async createChatRoom(
    @Body() body: SidebarBodyType,
    @Param('idOrEmail') idOrEmail: string
  ) {
    const jwt = body.jwt || ''
    try {
      await this.gkdJwtService.verifyAsync(jwt)
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
      await this.gkdJwtService.verifyAsync(jwt)
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

  @Get('/chatRoom/getChatBlocks/:cOId/:firstIdx')
  async getChatBlocks(
    @Headers() headers: any,
    @Param('cOId') cOId: string,
    @Param('firstIdx') firstIdx: number
  ) {
    const jwt = getJwtFromHeader(headers) ?? ''
    let returnedJwt: JwtPayload
    try {
      returnedJwt = await this.gkdJwtService.verifyAsync(jwt)
    } catch (error) {
      return {
        ok: false,
        body: {},
        errors: {jwt: 'Jwt invalid in getChatBlock'}
      }
    }

    const readyLock = await this.lockService.readyLock(`chat:${cOId}`)
    const uOId = returnedJwt.uOId
    const ret = await this.sidebarService.getChatBlocks(uOId, cOId, firstIdx)
    this.lockService.releaseLock(readyLock)
    return ret
  }

  @Get('/getChatRooms/:uOId')
  async getChatRooms(@Headers() headers: any, @Param('uOId') uOId: string) {
    const jwt = getJwtFromHeader(headers) ?? ''
    try {
      await this.gkdJwtService.verifyAsync(jwt)
    } catch (error) {
      return {
        ok: false,
        body: {},
        errors: {jwt: 'Jwt invalid in getChatRooms'}
      }
    }

    const ret = await this.sidebarService.getUserChatRooms(uOId)
    return ret
  }
  // BLANK LINE COMMENT:
}
