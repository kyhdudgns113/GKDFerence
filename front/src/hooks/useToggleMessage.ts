import {Dispatch, SetStateAction, useState} from 'react'

type useToggleMessageType = [
  boolean,
  Dispatch<SetStateAction<boolean>>,
  string,
  Dispatch<SetStateAction<string>>
]

export const useToggleMessage = (initialChecked = false, initialMessage = '') => {
  const [isTrue, setIsTrue] = useState<boolean>(initialChecked)
  const [message, setMessage] = useState<string>(initialMessage)

  return [isTrue, setIsTrue, message, setMessage] as useToggleMessageType
}
