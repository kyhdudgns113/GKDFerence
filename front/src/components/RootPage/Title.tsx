import {TextProps, Title as TitleBase} from '../Base'
import {FC} from 'react'

export const Title: FC<TextProps> = ({className: _className, ...props}) => {
  const className = [
    'flex justify-center mb-4', //
    _className
  ].join(' ')

  return (
    <div className={className}>
      <TitleBase>GKDFerence</TitleBase>
    </div>
  )
}
