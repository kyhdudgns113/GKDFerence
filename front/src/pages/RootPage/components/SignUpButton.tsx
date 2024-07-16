import {FC, PropsWithChildren} from 'react'
import {Button, ButtonProps} from '../../../components'
import {useNavigate} from 'react-router-dom'

export type SignUpButtonnProps = ButtonProps & {}

export const SignUpButton: FC<PropsWithChildren<SignUpButtonnProps>> = ({
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
    <Button className={className} type="button" onClick={e => navigate('/signup')} {...props}>
      Sign Up
    </Button>
  )
}
