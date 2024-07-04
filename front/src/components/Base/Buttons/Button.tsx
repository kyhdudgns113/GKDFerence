import {FC, PropsWithChildren} from 'react'
import type {ButtonCommonProps} from '../Props'

export type ButtonProps = ButtonCommonProps & {
  type?: 'button' | 'reset' | 'submit'
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  className: _className,
  type,
  ...props
}) => {
  const className = [
    'btn',
    'border-2 border-gkd-sakura-border',
    'bg-gkd-sakura-bg',
    'text-gkd-sakura-text',
    'hover:border-gkd-sakura-bg',
    'hover:bg-gkd-sakura-text',
    'hover:text-gkd-sakura-bg',
    _className
  ].join(' ')

  return <button type={type} {...props} className={className} />
}
