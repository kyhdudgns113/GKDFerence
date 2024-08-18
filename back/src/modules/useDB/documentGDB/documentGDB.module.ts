import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {
  DocumentG,
  DocumentGChatBlock,
  DocumentGChatBlockSchema,
  DocumentGContent,
  DocumentGContentSchema,
  DocumentGSchema
} from './documentGDB.entity'
import {DocumentGDBService} from './documentGDB.service'

@Module({
  imports: [
    MongooseModule.forFeature([{name: DocumentG.name, schema: DocumentGSchema}]),
    MongooseModule.forFeature([
      {name: DocumentGContent.name, schema: DocumentGContentSchema}
    ]),
    MongooseModule.forFeature([
      {name: DocumentGChatBlock.name, schema: DocumentGChatBlockSchema}
    ])
  ],
  providers: [DocumentGDBService],
  exports: [DocumentGDBService]
})
export class DocumentGDBModule {}
