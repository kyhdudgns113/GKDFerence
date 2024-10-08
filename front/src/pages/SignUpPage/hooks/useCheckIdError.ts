import {useEffect} from 'react'

export const useCheckIdError = (idVal: string, setIdErr: (msg: string) => void) => {
  useEffect(() => {
    if (!idVal) {
      setIdErr('<< ID 가 공란입니다. >>')
    } // BLANK LINE COMMENT:
    else {
      setIdErr('')
    }
  }, [idVal, setIdErr])
}
