import {ChangeEvent, Dispatch, FC, PropsWithChildren, SetStateAction} from 'react'

import {Input, InputProps} from './Input'

import * as T from '../Texts'

export type RowInputProps = InputProps & {
  val: string
  placeholder?: string
  inputType: string
  setVal: Dispatch<SetStateAction<string>>

  classNameText?: string
}

export const RowInput: FC<PropsWithChildren<RowInputProps>> = ({
  val,
  placeholder,
  inputType,
  setVal,
  className: _className,
  classNameText: _classNameText,
  children,
  ...props
}) => {
  const className_div = [
    'flex flex-row items-center', //
    'mt-2 mb-2',
    _className
  ].join(' ')
  const className_text = [
    'flex justify-center', //
    'font-bold', //
    _classNameText
  ].join(' ')

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value)
  }

  return (
    <div className={className_div}>
      <T.Text2XL className={className_text}>{children}</T.Text2XL>
      <Input
        type={inputType}
        value={val}
        onChange={onChange}
        placeholder={placeholder}
        {...props}></Input>
    </div>
  )
}
