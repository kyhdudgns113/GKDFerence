/**************************************************
 * This file needs to be changed simultaneously
 * with the back.common.types.ts
 **************************************************/

import {Dispatch, MutableRefObject, SetStateAction} from 'react'
import {Socket} from 'socket.io-client'
import {DefaultEventsMap} from 'socket.io/dist/typed-events'

export type Callback = () => void
export type DivRefType = MutableRefObject<HTMLDivElement | null> | null
export type KeyValueType = {[key: string]: string}
export type Setter<T> = Dispatch<SetStateAction<T>>
export type SocketType = Socket<DefaultEventsMap, DefaultEventsMap> | null

export type AuthBodyType = {
  jwt?: string
  id?: string
  uOId?: string
  email?: string
  password?: string
}
export type AuthObjectType = {
  ok: boolean
  body: AuthBodyType
  errors: ErrorsType
}
/**
 * It should be synchronized with chatroom.entity.ts
 */
export type ChatBlockType = {
  idx?: number
  id: string
  uOId: string
  date?: Date
  content: string
}
export type ChatBlocksType = ChatBlockType[]
export type DocAddUserBodyType = {
  jwt?: string
  idOrEmail: string
}
export type DocContentType = string | null
export type DocContentsType = DocContentType[]
export type DocUserInfoType = {
  id: string
  email: string
  uOId: string
}
export type DocTitleType = string

export type ErrorsType = KeyValueType
export interface JwtPayload {
  id: string
  uOId: string
  email: string
}
export type RowDocumentGType = {
  dOId: string
  title: string
}
export type RowSingleChatRoomType = {
  cOId: string
  tUOId: string
  tUId: string
  unreadChat: number
}
export type SidebarBodyType = {
  jwt?: string
  id?: string
  uOId?: string
  email?: string

  conferences?: {[key: string]: string}
  chatRooms?: {[key: string]: string}
  documents?: {[key: string]: string}
}
export type SidebarObjectType = {
  ok: boolean
  body: SidebarBodyType
  errors: ErrorsType
}
// SocketP Type
export type SocketUserConnectedType = {
  uOId: string
  socketPId?: string
}
export type SocketTestCountType = {
  id: string
  cnt: number
}
// SocketChat Type
export type SocketChatConnectedType = {
  jwt: string
  uOId: string
  cOId: string
  socketPId: string
}
export type SocketChatContentType = {
  jwt: string
  cOId: string
  body: ChatBlockType
}
export type SocketSetUnreadChatType = {
  uOId: string
  cOId: string
  unreadChat: number
}
// SocketDoc Type
export type SocketDocChatContentType = {
  jwt: string
  dOId: string
  body: ChatBlockType
}
export type SocketDocConnectedType = {
  jwt: string
  uOId: string
  dOId: string
  socketPId: string
}
export type SocketDocChangeType = {
  jwt?: string
  readyLock?: string
  uOId: string
  dOId: string
  whichChanged: 'title' | 'contents'
  startRow: number | null
  endRow: number | null
  title?: DocTitleType
  contents?: DocContentsType
}
export type SocketDocRequestLockType = {
  jwt?: string
  uOId: string
  dOId: string
  readyLock?: string
}
// asdfasdfasdf
export type UserBodyType = {
  jwt?: string
  id?: string
  uOId?: string
  email?: string
  singleChatRooms?: KeyValueType
}
