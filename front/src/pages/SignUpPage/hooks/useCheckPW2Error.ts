import {useEffect} from 'react'

export const useCheckPW2Error = (
  pwVal: string,
  pw2Val: string,
  setPw2Err: (msg: string) => void
) => {
  useEffect(() => {
    if (!pw2Val) {
      setPw2Err('<< 비밀번호가 공란입니다. >>')
    } else if (pwVal !== pw2Val) {
      setPw2Err('<< 비밀번호가 틀립니다. >>')
    } else {
      setPw2Err('')
    }
  }, [pwVal, pw2Val, setPw2Err])
}
