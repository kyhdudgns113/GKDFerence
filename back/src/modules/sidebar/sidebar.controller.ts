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

@Controller('sidebar')
export class SidebarController {
  private logger: Logger = new Logger('SidebarController')
  constructor(private readonly sidebarService: SidebarService) {}

  // AREA2 : Post
  @Post()
  async post(@Body() arg: any) {
    return 'post'
  }

  // AREA2 : Get
  @Get('/findUser/:idOrEmail')
  async findUser(@Headers() headers, @Param() idOrEmail: string) {
    const jwt = getJwtFromHeader(headers) ?? ''
    return 'get'
  }
}
