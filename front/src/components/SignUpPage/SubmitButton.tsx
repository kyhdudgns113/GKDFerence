import {FC, MouseEvent, useCallback} from 'react'
import {Button, ButtonCommonProps} from '../Base'
import {useSignUpContext, useAuth} from '../../contexts'
import {useNavigate} from 'react-router-dom'

export type SubmitButtonProps = ButtonCommonProps & {
  //
}

export const SubmitButton: FC<SubmitButtonProps> = ({
  className: _className, //
  ...props
}) => {
  const className = [
    'w-1/3 text-xl', //
    _className
  ].join(' ')

  const {checkToken} = useAuth()
  const {submitFunction} = useSignUpContext()
  const navigate = useNavigate()

  /** Block submit if already logged */
  const onClick = useCallback(
    (e: MouseEvent) => {
      checkToken(
        () => navigate('/main'),
        () => submitFunction()
      )
    },
    [navigate, submitFunction, checkToken]
  )

  return (
    <Button className={className} {...props} onClick={onClick}>
      Submit
    </Button>
  )
}
