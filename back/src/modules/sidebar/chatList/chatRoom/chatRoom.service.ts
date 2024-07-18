import {Injectable} from '@nestjs/common'
import {UseDBService} from 'src/modules/useDB/useDB.service'

@Injectable()
export class ChatRoomService {
  constructor(private useDBService: UseDBService) {}

  async getUserList(uOId: string, cOId: string) {
    if (!(await this.useDBService.ChatRoomHasUser(cOId, uOId))) {
      return null
    }
    // TODO: 코드 리팩토링... 컨트롤러에서 JWT 검증하게 하자.
    return await this.useDBService.getChatRoomUserList(cOId)
  }
  // BLANK LINE COMMENT
}
