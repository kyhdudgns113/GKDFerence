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
import {getJwtFromHeader} from 'src/util'
import {ChatListService} from './chatList.service'

@Controller('sidebar/chatList')
export class ChatListController {
  private logger: Logger = new Logger('ChatListController')
  constructor(private readonly chatListService: ChatListService) {}

  // AREA2 : Get
  @Get('/getChatRoomData/:chatOId')
  async testYes(@Headers() headers: any, @Param('chatOId') chatOId: string) {
    // TODO: 채팅 정보 리턴하기
    const jwt = getJwtFromHeader(headers)

    return {
      ok: true,
      body: {},
      errors: {}
    }
  }
}
