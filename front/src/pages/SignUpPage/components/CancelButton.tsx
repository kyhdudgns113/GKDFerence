import {FC, MouseEvent, useCallback} from 'react'
import {Button, ButtonCommonProps} from '../../../components'
import {useNavigate} from 'react-router-dom'

export type CancelButtonProps = ButtonCommonProps & {}

export const CancelButton: FC<CancelButtonProps> = ({
  className: _className, //
  ...props
}) => {
  const className = [
    'w-1/3 text-xl', //
    _className
  ].join(' ')

  const navigate = useNavigate()

  const onClickCancel = useCallback(
    (e: MouseEvent) => {
      navigate('/')
    },
    [navigate]
  )

  return (
    <Button className={className} {...props} onClick={onClickCancel}>
      Cancel
    </Button>
  )
}
