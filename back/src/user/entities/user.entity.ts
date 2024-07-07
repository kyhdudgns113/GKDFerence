import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class User extends Document {
  /** User ID */
  @Prop()
  id: string

  @Prop()
  email: string

  @Prop()
  hashedPassword: string

  @Prop()
  createdDt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
