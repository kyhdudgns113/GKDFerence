import {FC} from 'react'

import {ParagraphCommonProps} from '../../Base/Props'

import * as T from '../../Base/Texts'

export type TextProps = ParagraphCommonProps & {}

export const Text: FC<TextProps> = ({className: _className, ...props}) => {
  const className = [
    '', //
    _className
  ].join(' ')

  return <T.Text_xl className={className} {...props} />
}
