import {getServerUrl} from './getServerUrl'

const getOrDel =
  (methodName: string, jwt?: string | null | undefined) =>
  (path: string, jwt?: string | null | undefined) => {
    let headers = {'Content-Type': 'application/json'}
    let init: RequestInit = {
      method: methodName
    }

    if (jwt) {
      init = {
        ...init,
        headers: {...headers, Authorization: `Bearer ${jwt}`}
      }
    } // BLANK LINE COMMENT:
    else init = {...init, headers}
    return fetch(getServerUrl(path), init)
  }
export const get = getOrDel('GET')
export const del = getOrDel('DELETE')
