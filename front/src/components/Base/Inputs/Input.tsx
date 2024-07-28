import {ChangeEvent, FC, PropsWithChildren} from 'react'
import type {InputCommonProps} from '../Props'

export type InputProps = InputCommonProps & {
  value?: string
  placeholder?: string
  type?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export const Input: FC<PropsWithChildren<InputProps>> = ({
  value,
  placeholder,
  type,
  onChange,

  className: _className,
  ...props
}) => {
  const className = [
    'ml-2 p-2',
    'text-gkd-sakura-text',
    'placeholder-gkd-sakura-placeholder',
    'focus:outline-gkd-sakura-border',
    'border-gkd-sakura-border/50 border-2 rounded-lg',
    _className
  ].join(' ')

  return (
    <input
      {...props}
      value={value}
      type={type}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  )
}
