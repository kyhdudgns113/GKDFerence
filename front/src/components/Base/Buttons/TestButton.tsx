import {FC, PropsWithChildren} from 'react'
import type {ButtonCommonProps} from '../Props'

export type TestButtonProps = ButtonCommonProps & {
  type?: 'button' | 'reset' | 'submit'
}

export const TestButton: FC<PropsWithChildren<TestButtonProps>> = ({
  className: _className,
  type,
  ...props
}) => {
  const className = [
    'btn',
    'mt-2',
    'border-2 border-gkd-sakura-border',
    'bg-gkd-sakura-testbtn-bg',
    'text-gkd-sakura-testbtn-text',
    'hover:border-gkd-sakura-bg',
    'hover:bg-gkd-sakura-hover-button',
    'hover:text-gkd-sakura-darker-text',
    _className
  ].join(' ')

  return <button type={type} {...props} className={className} style={{minWidth: '150px'}} />
}
