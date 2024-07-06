import {FC, MouseEvent} from 'react'
import {Button, ButtonCommonProps} from '../Base'

export type SubmitButtonProps = ButtonCommonProps & {
  onClick?: (e: MouseEvent) => void
}

export const SubmitButton: FC<SubmitButtonProps> = ({
  onClick,
  className: _className, //
  ...props
}) => {
  const className = [
    'w-1/3 text-xl', //
    _className
  ].join(' ')

  return (
    <Button className={className} {...props} onClick={onClick}>
      Submit
    </Button>
  )
}
