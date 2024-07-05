import {FC} from 'react'
import {Button, ButtonCommonProps} from '../Base'

export type SubmitButtonProps = ButtonCommonProps & {}

export const SubmitButton: FC<SubmitButtonProps> = ({
  className: _className, //
  ...props
}) => {
  const className = [
    'w-1/3 text-xl', //
    _className
  ].join(' ')

  return (
    <Button className={className} {...props}>
      Submit
    </Button>
  )
}
