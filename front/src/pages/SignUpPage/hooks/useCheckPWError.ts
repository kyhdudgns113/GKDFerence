import {useEffect} from 'react'

export const useCheckPWError = (pwVal: string, setPwErr: (msg: string) => void) => {
  useEffect(() => {
    if (!pwVal) {
      setPwErr('<< 비밀번호가 공란입니다. >>')
    } // BLANK LINE COMMENT:
    else {
      setPwErr('')
    }
  }, [pwVal, setPwErr])
}
