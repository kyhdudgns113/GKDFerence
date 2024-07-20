import {FC} from 'react'

import {ParagraphCommonProps} from '../../../../components/Base'

import * as T from '../../../../components/Base'

export type TextProps = ParagraphCommonProps & {}

export const Text: FC<TextProps> = ({className: _className, ...props}) => {
  const className = [
    '', //
    _className
  ].join(' ')

  return <T.TextXL className={className} {...props} />
}
