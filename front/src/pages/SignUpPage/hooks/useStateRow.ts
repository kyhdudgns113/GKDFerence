import {useState} from 'react'
import {Setter} from '../../../common'

export type useStateRowType = [string, Setter<string>, string, Setter<string>]

export const useStateRow = () => {
  const [val, setVal] = useState<string>('')
  const [err, setErr] = useState<string>('')

  return [val, setVal, err, setErr] as useStateRowType
}
