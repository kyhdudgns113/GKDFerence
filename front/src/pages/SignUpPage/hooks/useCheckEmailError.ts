import {useEffect} from 'react'

export const useCheckEmailError = (email: string, setEmailErr: (msg: string) => void) => {
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email) {
      setEmailErr('<< 이메일이 공란입니다. >>')
    } else if (email && !emailRegex.test(email)) {
      setEmailErr('<< 이메일 형식이 아닙니다. >>')
    } else {
      setEmailErr('')
    }
  }, [email, setEmailErr])
}
