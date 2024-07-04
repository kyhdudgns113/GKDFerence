import type {FC, DetailedHTMLProps, HTMLAttributes} from 'react'

type ReactSpanProps = DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>

export type IconProps = ReactSpanProps & {
  name: string
}

export const Icon: FC<IconProps> = ({name, className: _className, ...props}) => {
  const className = [
    'material-icons text-gkd-sakura-text', //
    _className
  ].join(' ')
  return (
    <span {...props} className={className}>
      {name}
    </span>
  )
}
