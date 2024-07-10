export type Callback = () => void
export type AuthBodyType = {
  jwt?: string
  id?: string
  email?: string
  password?: string
}
export type AuthObjectType = {
  ok: boolean
  body: AuthBodyType
  errors: {[key: string]: string}
}
export interface JwtPayload {
  id: string
  email: string
}
