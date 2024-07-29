import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {DocumentG, DocumentGContent} from './documentGDB.entity'

@Injectable()
export class DocumentGDBService {
  constructor(
    @InjectModel(DocumentG.name) private documentGModel: Model<DocumentG>,
    @InjectModel(DocumentGContent.name)
    private documentGContentModel: Model<DocumentGContent>
  ) {}

  async createDocumentG(uOIds: string[]) {
    const docsUOIDs: {[uOId: string]: boolean} = {}
    uOIds.forEach(_uOId => (docsUOIDs[_uOId] = true))

    const newDocumentG = new this.documentGModel({
      title: '새 문서',
      uOIds: docsUOIDs,
      createdDt: new Date()
    })

    const ret = await newDocumentG.save()

    return ret
  }

  async documentGHasUser(dOId: string, uOId: string) {
    const documentG = await this.findOneByObjectId(dOId)

    if (!documentG || !documentG.uOIds[uOId]) {
      return false
    }
    return true
  }

  async findOneByObjectId(dOId: string) {
    const _id = new Types.ObjectId(dOId)
    const documentG = await this.documentGModel.findOne({_id: _id})
    return documentG
  }

  async getDocumentG(dOId: string) {
    const documentG = await this.findOneByObjectId(dOId)
    if (!documentG) {
      return null
    }
    return {title: documentG.title, contents: documentG.contents}
  }

  // BLANK LINE COMMENT
}
