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
import {CopyMeService} from './_CopyMe.service'

@Controller('CopyMe')
export class CopyMeController {
  private logger: Logger = new Logger('CopyMeController')
  constructor(private readonly copyService: CopyMeService) {}

  // AREA2: Post
  @Post()
  async post(@Body() arg: any) {
    return 'post'
  }

  // AREA2: Get
  @Get()
  async get(@Headers() arg: any) {
    return 'get'
  }
}
