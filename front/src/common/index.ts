/**************************************************
 * This file needs to be changed simultaneously
 * with the back.common.types.ts
 **************************************************/

import {ObjectId} from 'mongoose'

export type Callback = () => void
export type KeyValueType = {[key: string]: string}
export type KeyObjectIdType = {[_idToString: string]: ObjectId}

export type AuthBodyType = {
  jwt?: string
  id?: string
  _id?: string
  email?: string
  password?: string
}
export type AuthObjectType = {
  ok: boolean
  body: AuthBodyType
  errors: KeyValueType | null
}
export type ErrorsType = KeyValueType
export interface JwtPayload {
  id: string
  _id: ObjectId
  email: string
}
export type SocketUserConnectedType = {
  id: string
}
export type SocketTestCountType = {
  id: string
  cnt: number
}
export type UserBodyType = {
  jwt?: string
  id?: string
  _id?: string
  email?: string
  singleChatList?: KeyObjectIdType
}
