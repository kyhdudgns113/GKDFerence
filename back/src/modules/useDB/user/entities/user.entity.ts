import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document, ObjectId} from 'mongoose'

@Schema()
export class User extends Document {
  /** Object Id is in extended class Document */

  /** User ID. Not ObjectId */
  @Prop()
  id: string

  @Prop()
  email: string

  @Prop()
  hashedPassword: string

  /**
   * singleChatList[userObjectId] = chatRoomObjectId
   */
  @Prop({type: Object})
  singleChatList: {[userObjectId: string]: ObjectId}

  @Prop()
  createdDt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
