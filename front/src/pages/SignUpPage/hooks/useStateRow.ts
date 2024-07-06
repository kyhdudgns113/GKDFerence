import {Dispatch, SetStateAction, useState} from 'react'

export type useStateRowType = [
  string,
  Dispatch<SetStateAction<string>>,
  string,
  Dispatch<SetStateAction<string>>
]

export const useStateRow = () => {
  const [val, setVal] = useState<string>('')
  const [err, setErr] = useState<string>('')

  return [val, setVal, err, setErr] as useStateRowType
}
