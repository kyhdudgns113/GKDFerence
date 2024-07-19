/**************************************************
 * This file needs to be changed simultaneously
 * with the front.src.common.index.ts
 **************************************************/

export type Callback = () => void
export type KeyValueType = {[key: string]: string}

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
 * 클라이언트에서 서버로 갈 때는 인덱스를 전달할 수 없으니 ? 로 한다
 */
export type ChatBlockType = {
  idx?: number
  id: string
  uOId: string
  date?: Date
  content: string
}
export type ErrorsType = KeyValueType
export interface JwtPayload {
  id: string
  uOId: string
  email: string
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
export type SocketChatUnreadChatType = {
  uOId: string
  cOId: string
  unreadChat: number
}

export type UserBodyType = {
  jwt?: string
  id?: string
  uOId?: string
  email?: string
  singleChatRooms?: KeyValueType
}
