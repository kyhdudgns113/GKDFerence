import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

// FUTURE: 이미지도 저장 가능하도록 조정해야 한다.
// FUTURE: 그래서 DocContent Schema 를 따로 만들었다.
@Schema()
export class DocumentGContent extends Document {
  @Prop()
  content: string
}

export const DocumentGContentSchema = SchemaFactory.createForClass(DocumentGContent)

@Schema()
export class DocumentG extends Document {
  /** Object Id is in extended class Document */

  @Prop({type: String})
  title: string

  @Prop({type: Object})
  uOIds: {[uOId: string]: boolean}

  @Prop({type: [DocumentGContentSchema], default: []})
  contents: DocumentGContent[]

  @Prop({type: Date, default: Date.now})
  createdDt: Date
}

export const DocumentGSchema = SchemaFactory.createForClass(DocumentG)
