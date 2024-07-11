import {FC, PropsWithChildren} from 'react'
import {Button, ButtonProps} from '../Base/Buttons'
import {useRootPageContext} from '../../contexts'

export type LoginButtonProps = ButtonProps & {
  //
}

export const LoginButton: FC<PropsWithChildren<LoginButtonProps>> = ({
  className: _className,
  ...props
}) => {
  const className = [
    'w-1/3', //
    'text-xl',
    _className
  ].join(' ')
  const {onLogin} = useRootPageContext()

  return (
    <Button className={className} type="submit" onClick={e => onLogin()} {...props}>
      Log In
    </Button>
  )
}
