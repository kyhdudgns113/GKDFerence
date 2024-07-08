export type Callback = () => void
export type AuthBodyType = {
  jwt?: string
  id?: string
  email?: string
  password?: string
  _id?: string
}
export type AuthObjectType = {
  ok: boolean
  body: AuthBodyType
  errors: {[key: string]: string}
}
