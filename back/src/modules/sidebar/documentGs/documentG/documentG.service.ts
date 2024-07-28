import {Injectable} from '@nestjs/common'
import {UseDBService} from 'src/modules/useDB/useDB.service'

@Injectable()
export class DocumentGService {
  constructor(private useDBService: UseDBService) {}

  async getUserList(uOId: string, cOId: string) {
    // if (!(await this.useDBService.ChatRoomHasUser(cOId, uOId))) {
    //   return null
    // }
    // return await this.useDBService.getChatRoomUsers(cOId)
  }
  // BLANK LINE COMMENT
}
