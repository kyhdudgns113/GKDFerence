import * as U from '.'
import {AuthBodyType, Callback, Setter} from '../common'

/**
 * It write jwt in local storage too
 *
 * @param body : req body
 * @param setId : id setter function
 * @param setUOId : uOId setter function
 * @param setEmail : email setter function
 * @param callback : callback function if writting is finished.
 */
export const writeBodyObject = (
  body: AuthBodyType | undefined,
  setId: Setter<string>,
  setUOId: Setter<string>,
  setEmail: Setter<string>,
  setJwt: Setter<string>,
  callback?: Callback | undefined
) => {
  U.writeStringP('jwt', body?.jwt ?? '').then(() => {
    U.writeStringP('id', body?.id ?? '').then(() => {
      U.writeStringP('uOId', body?.uOId ?? '').then(() => {
        U.writeStringP('email', body?.email ?? '').then(() => {
          setId(body?.id || '')
          setUOId(body?.uOId || '')
          setEmail(body?.email || '')
          setJwt(body?.jwt || '')
          callback && callback()
        })
      })
    })
  })
}
