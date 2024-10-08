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
   * singleChatRooms[uOId] = cOId
   * Map 으로 해버리면 사용하기가 힘들어진다.
   */
  @Prop({type: Object, default: {}})
  singleChatRooms: {[uOId: string]: string}

  @Prop({type: Object, default: {}})
  unReadChats: {[cOId: string]: number}

  @Prop({type: Object, default: {}})
  unReadChatsDoc: {[cOId: string]: number}

  /**
   * documentGs[dOId] = true
   */
  @Prop({type: Object, default: {}})
  documentGs: {[dOId: string]: boolean}

  @Prop({type: Date, default: Date.now})
  createdDt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
