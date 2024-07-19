import {FC} from 'react'
import {DivCommonProps, Icon} from '../../Base'
import {useLayoutContext} from '../../../contexts'
import {Text} from '../Header'
import {classNameRowTitle} from './className'

export type DocumentsProps = DivCommonProps & {
  //
}

export const Documents: FC<DocumentsProps> = () => {
  const {showDoc, setShowDoc} = useLayoutContext() // eslint-disable-line

  return (
    <div className="flex flex-col">
      <div
        className={classNameRowTitle}
        onClick={e => {
          setShowDoc(prev => !prev)
        }}
        style={{userSelect: 'none'}}>
        <Text>&nbsp;&nbsp;Documents</Text>
        <Icon className="text-3xl" name={showDoc ? 'arrow_drop_down' : 'arrow_right'}></Icon>
      </div>
    </div>
  )
}
