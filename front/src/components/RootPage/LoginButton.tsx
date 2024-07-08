import {Dispatch, FC, MouseEvent, PropsWithChildren, SetStateAction, useCallback} from 'react'
import {Button, ButtonProps} from '../Base/Buttons'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'

export type ArgLoginButtonProps = {
  idVal: string
  setIdErr: Dispatch<SetStateAction<string>>
  pwVal: string
  setPwErr: Dispatch<SetStateAction<string>>
}

export type LoginButtonProps = ButtonProps & {
  arg: ArgLoginButtonProps
}

export const LoginButton: FC<PropsWithChildren<LoginButtonProps>> = ({
  arg,
  className: _className,
  ...props
}) => {
  const className = [
    'w-1/3', //
    'text-xl',
    _className
  ].join(' ')

  /* eslint-disable */
  const navigate = useNavigate()
  const {login} = useAuth()
  const {idVal, pwVal, setIdErr, setPwErr} = arg
  /* eslint-enable */

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
