import {FC, PropsWithChildren} from 'react'
import {Button, ButtonProps} from '../Base/Buttons'
import {useNavigate} from 'react-router-dom'

export type LoginButtonProps = ButtonProps & {}

export const LoginButton: FC<PropsWithChildren<LoginButtonProps>> = ({
  className: _className,
  ...props
}) => {
  const className = [
    'w-1/3', //
    'text-xl',
    _className
  ].join(' ')

  const navigate = useNavigate()

  return (
    <Button
      className={className}
      type="submit"
      onClick={e => navigate('/login')}
      {...props}>
      Log In
    </Button>
  )
}
