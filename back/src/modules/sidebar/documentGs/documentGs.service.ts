import {Injectable} from '@nestjs/common'
import {DocUserInfoType, SidebarBodyType} from 'src/common'
import {UseDBService} from 'src/modules/useDB/useDB.service'

@Injectable()
export class DocumentGsService {
  constructor(private useDBService: UseDBService) {}

  async addUserToDocumentG(dOId: string, idOrEmail: string) {
    try {
      const ret = await this.useDBService.addUserToDocumentG(dOId, idOrEmail)
      return ret
    } catch (error) {
      throw error
    }
  }

  async createDocumentG(body: SidebarBodyType) {
    const uOId = body.uOId
    const ret = await this.useDBService.createDocumentG(uOId)

    return ret
  }

  /**
   * documentG 의 title 과 contents 를 가져온다.
   */
  async getDocumentG(dOId: string) {
    const ret = await this.useDBService.getDocumentG(dOId)
    return ret
  }

  async getDocumentGs(uOId: string) {
    const documentGs = await this.useDBService.findDocumentGs(uOId)
    return documentGs
  }

  async getDocumentGUsers(uOId: string, dOId: string) {
    const isDocHasThisUser = await this.useDBService.DocumentGHasUser(dOId, uOId)
    if (!isDocHasThisUser) {
      return null
    }

    const uOIds = await this.useDBService.getDocumentGUsers(dOId)
    const ret: DocUserInfoType[] = await Promise.all(
      uOIds.map(async (uOId, idx) => {
        const {id, email} = await this.useDBService.getUserIdEmail(uOId)
        return {id, email, uOId}
      })
    )

    return ret
  }
  // BLANK LINE COMMENT:
}
