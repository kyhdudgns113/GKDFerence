import {Injectable} from '@nestjs/common'
import {SidebarBodyType} from 'src/common'
import {UseDBService} from 'src/modules/useDB/useDB.service'

@Injectable()
export class DocumentGsService {
  constructor(private useDBService: UseDBService) {}

  async createDocumentG(body: SidebarBodyType) {
    const uOId = body.uOId
    const ret = await this.useDBService.createDocumentG(uOId)

    return ret
  }

  async getDocumentGs(uOId: string) {
    const documentGs = this.useDBService.findDocumentGs(uOId)
    return documentGs
  }
  // BLANK LINE COMMENT
}
