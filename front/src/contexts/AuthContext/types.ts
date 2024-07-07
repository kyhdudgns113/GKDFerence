export type Callback = () => void
export type AuthBodyType = {
  jwt?: string
  id?: string
  email?: string
  _id?: string
}
export type ErrorsType = {[key: string]: string}
