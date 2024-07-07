import * as U from '../../utils'
import type {Callback, AuthBodyType} from './types'

export const writeBodyObject = (
  body: AuthBodyType | undefined,
  callback?: Callback | undefined
) => {
  U.writeStringP('jwt', body?.jwt ?? '').then(() => {
    U.writeStringP('id', body?.id ?? '').then(() =>
      U.writeStringP('email', body?.email ?? '').then(() =>
        U.writeStringP('_id', body?._id ?? '').then(() => {
          callback && callback()
        })
      )
    )
  })
}
