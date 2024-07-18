/**************************************************
 * This file needs to be changed simultaneously
 * with the front.src.common.index.ts
 **************************************************/

export type Callback = () => void
export type KeyValueType = {[key: string]: string}

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
  errors: ErrorsType
}
/**
 * It should be synchronized with chatroom.entity.ts
 * 클라이언트에서 서버로 갈 때는 인덱스를 전달할 수 없으니 ? 로 한다
 */
export type ChatContentType = {
  idx?: number
  id: string
  _id: string
  date?: Date
  content: string
}
export type ErrorsType = KeyValueType
export interface JwtPayload {
  id: string
  _id: string
  email: string
}
export type RowSingleChatRoomType = {
  chatRoomOId: string
  targetUOId: string
  targetId: string
}
export type SidebarBodyType = {
  jwt?: string
  id?: string
  _id?: string
  email?: string

  confList?: {[key: string]: string}
  chatList?: {[key: string]: string}
  docList?: {[key: string]: string}
}
export type SidebarObjectType = {
  ok: boolean
  body: SidebarBodyType
  errors: ErrorsType
}
// SocketP Type
export type SocketUserConnectedType = {
  _id: string
  pid?: string
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
  body: ChatContentType
}
export type UserBodyType = {
  jwt?: string
  id?: string
  _id?: string
  email?: string
  singleChatList?: KeyValueType
}
