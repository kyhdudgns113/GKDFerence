import {FC} from 'react'
import {TextProps, Title as TitleBase} from '../Base'

export const Title: FC<TextProps> = ({className: _className, ...props}) => {
  const className = ['flex justify-center mb-4', _className].join(' ')

  return (
    <div className={className}>
      <TitleBase>Sign Up</TitleBase>
    </div>
  )
}
