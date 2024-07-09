import {FC, MouseEvent, PropsWithChildren, useCallback} from 'react'
import {Button, ButtonProps} from '../Base/Buttons'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'
import {useRootPageContext} from '../../contexts/RootPageContext'

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

  const navigate = useNavigate()
  const {login} = useAuth()
  const {idVal, pwVal, setIdErr, setPwErr} = useRootPageContext()

  const onClick = useCallback(
    (e: MouseEvent) => {
      login(idVal, pwVal)
        .then(_ => navigate('/main'))
        .catch(errors => {
          setIdErr(errors['id'])
          setPwErr(errors['password'])
        })
    },
    [idVal, pwVal, setIdErr, setPwErr, login, navigate]
  )

  return (
    <Button className={className} type="submit" onClick={onClick} {...props}>
      Log In
    </Button>
  )
}
