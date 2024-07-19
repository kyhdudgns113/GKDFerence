import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document, now, ObjectId} from 'mongoose'

@Schema()
export class User extends Document {
  /** Object Id is in extended class Document */

  /** User ID. Not ObjectId */
  @Prop({type: String})
  id: string

  @Prop({type: String})
  email: string

  @Prop({type: String})
  hashedPassword: string

  /**
   * singleChatList[userObjectId] = chatRoomObjectId
   * Map 으로 해버리면 사용하기가 힘들어진다.
   */
  @Prop({type: Object, default: {}})
  singleChatRooms: {[userObjectId: string]: string}

  @Prop({type: Object, default: {}})
  unReadChats: {[chatRoomObjectId: string]: number}

  @Prop({type: Date, default: Date.now})
  createdDt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
