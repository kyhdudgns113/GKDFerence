import {serverUrl} from '../client_secret'

export const getServerUrl = (path: string) => {
  const host = serverUrl
  return [host, path].join('')
}
