import {FC, MouseEvent, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {DivCommonProps, Icon} from '../../../../components/Base'
import {useLayoutContext} from '../../../../contexts'
import {Text} from '../../Header/components'
import {classNameRowTitle} from './className'

import * as T from '../../../../components/Base/Texts'
import {RowDocumentGType} from '../../../../common'

export type DocumentsProps = DivCommonProps & {
  //
}

export const Documents: FC<DocumentsProps> = () => {
  const {showDoc, setShowDoc, documentGs} = useLayoutContext()
  const navigate = useNavigate()

  const onClickDocumentG = useCallback(
    (row: RowDocumentGType) => (e: MouseEvent) => {
      e.stopPropagation()
      navigate(`/main/dc/${row.dOId}`, {
        state: {dOId: row.dOId, title: row.title}
      })
    },
    [navigate]
  )

  return (
    <div className="flex flex-col">
      <div className={classNameRowTitle} onClick={e => setShowDoc(prev => !prev)}>
        <Text>&nbsp;&nbsp;Documents</Text>
        <Icon className="text-3xl" name={showDoc ? 'arrow_drop_down' : 'arrow_right'}></Icon>
      </div>
      {showDoc && (
        <div className="mt-2">
          {documentGs?.map(row => {
            return (
              <div
                className="pl-8 pt-1 pb-1 select-none flex flex-row cursor-pointer hover:bg-gkd-sakura-bg-70 items-center"
                key={`docsRow:${row.dOId}`}
                onClick={onClickDocumentG(row)}>
                <Icon name="chat" className="flex items-center text-xl" />
                <T.TextXL className="flex items-center ml-2">{row.title}</T.TextXL>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
