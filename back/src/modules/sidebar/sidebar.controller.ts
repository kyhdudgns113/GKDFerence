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
import {SidebarBodyType} from 'src/common'

@Controller('sidebar')
export class SidebarController {
  private logger: Logger = new Logger('SidebarController')
  constructor(private readonly sidebarService: SidebarService) {}

  // AREA2 : Post
  @Post('/createSingleChatRoom/:idOrEmail')
  async createChatRoom(
    @Body() body: SidebarBodyType,
    @Param('idOrEmail') idOrEmail: string
  ) {
    const ret = await this.sidebarService.createSingleChatRoom(body, idOrEmail)
    return ret
  }

  // AREA2 : Get
  @Get('/getChatList/:uOId')
  async getChatList(@Headers() headers: any, @Param('uOId') uOId: string) {
    const jwt = getJwtFromHeader(headers) ?? ''
    const ret = this.sidebarService.getUserChatRoomList(jwt, uOId)
    return ret
  }

  @Get('/findUser/:idOrEmail')
  async findUser(@Headers() headers: any, @Param('idOrEmail') idOrEmail: string) {
    const jwt = getJwtFromHeader(headers) ?? ''
    const ret = await this.sidebarService.findUserIdOrEmail(jwt, idOrEmail)
    return ret
  }
}
