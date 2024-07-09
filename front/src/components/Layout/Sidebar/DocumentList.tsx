import {FC} from 'react'
import {DivCommonProps, Icon} from '../../Base'
import {useLayoutContext} from '../../../contexts/LayoutContext'
import {Text} from '../Header'
import {classNameRowTitle} from './className'

export type DocumentListProps = DivCommonProps & {
  //
}

export const DocumentList: FC<DocumentListProps> = () => {
  const {showDoc, setShowDoc} = useLayoutContext() // eslint-disable-line

  return (
    <div className="flex flex-col">
      <div
        className={classNameRowTitle}
        onClick={e => {
          setShowDoc(prev => !prev)
        }}
        style={{userSelect: 'none'}}>
        <Text>&nbsp;&nbsp;Document List</Text>
        <Icon className="text-3xl" name={showDoc ? 'arrow_drop_down' : 'arrow_right'}></Icon>
      </div>
    </div>
  )
}
