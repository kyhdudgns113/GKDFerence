import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {DocumentG, DocumentGContent} from './documentGDB.entity'
import {SocketDocChangeType} from 'src/common'

@Injectable()
export class DocumentGDBService {
  constructor(
    @InjectModel(DocumentG.name) private documentGModel: Model<DocumentG>,
    @InjectModel(DocumentGContent.name)
    private documentGContentModel: Model<DocumentGContent>
  ) {}

  async applyDocumentGChangeInfo(payload: SocketDocChangeType) {
    const {dOId, startRow, endRow, contents, title, whichChanged} = payload
    const _id = new Types.ObjectId(dOId)
    if (startRow === null || endRow == null) {
      console.log('row is null in docGDB service')
      return true
    }
    if (whichChanged === 'title') {
      const ret = await this.documentGModel.updateOne({_id: _id}, {$set: {title: title}})
      return Boolean(ret)
    } else {
      try {
        const documentG = await this.documentGModel.findOne({_id: _id})

        // 삭제할 것 있으면 삭제한다.
        if (startRow <= endRow && documentG.contents.length > 0) {
          const deleteIds = documentG.contents
            .slice(startRow, endRow + 1)
            .map(content => content._id)
          await this.documentGModel.updateOne(
            {_id: _id},
            {$pull: {contents: {_id: {$in: deleteIds}}}}
          )
        }

        // 추가할 것 있으면 추가한다.
        if (contents && contents.length > 0) {
          const newDocumentGContents = contents.map(
            content =>
              new this.documentGContentModel({
                content: content
              })
          )
          await this.documentGModel.updateOne(
            {_id: _id},
            {
              $push: {
                contents: {
                  $each: newDocumentGContents,
                  $position: startRow
                }
              }
            }
          )
        }

        return true
      } catch (err) {
        return false
      }
    }
  }

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
