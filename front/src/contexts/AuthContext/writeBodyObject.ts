import * as U from '../../utils'
import type {Callback, BodyType} from './types'

export const writeBodyObject = (body: BodyType | undefined, callback: Callback | undefined) => {
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
