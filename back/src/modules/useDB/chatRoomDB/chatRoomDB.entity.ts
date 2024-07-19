import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class ChatBlock {
  @Prop()
  idx: number

  @Prop()
  id: string

  @Prop()
  uOId: string

  @Prop()
  date: Date

  @Prop()
  content: string
}

export const ChatBlockSchema = SchemaFactory.createForClass(ChatBlock)

@Schema()
export class ChatRoom extends Document {
  /** Object Id is in extended class Document */

  @Prop({type: Object})
  uOIds: {[uOId: string]: boolean}

  @Prop({type: [ChatBlockSchema], default: []})
  chatBlocks: ChatBlock[]

  @Prop({type: Date, default: Date.now})
  createdDt: Date
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom)
