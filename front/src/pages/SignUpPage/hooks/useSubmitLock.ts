import {useEffect} from 'react'
import {Setter} from '../../../common'

export const useSubmitLock = (submitLock: boolean, setSubmitLock: Setter<boolean>) => {
  useEffect(() => {
    if (submitLock) {
      let yes = 0
      const id = setInterval(() => {
        if (yes < 1) {
          yes += 1
        } else {
          setSubmitLock(false)
          clearInterval(id)
        }
      }, 1000)
    }
  }, [submitLock, setSubmitLock])
}
