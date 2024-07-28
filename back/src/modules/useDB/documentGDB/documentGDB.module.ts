import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {
  DocumentG,
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
    ])
  ],
  providers: [DocumentGDBService],
  exports: [DocumentGDBService]
})
export class DocumentGDBModule {}
