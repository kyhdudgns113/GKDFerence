import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

// id: string
//   _id: string
//   date: Date
//   content: string

@Schema()
export class ChatContentSchema {
  @Prop({required: true})
  id: string

  @Prop({required: true})
  _id: string

  @Prop({required: true})
  date: Date

  @Prop({required: true})
  content: string
}

@Schema()
export class ChatRoom extends Document {
  /** Object Id is in extended class Document */

  @Prop({type: Object})
  users: {[userObjectId: string]: boolean}

  @Prop({type: [ChatContentSchema]})
  chats: ChatContentSchema[]

  @Prop()
  createdDt: Date
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom)
