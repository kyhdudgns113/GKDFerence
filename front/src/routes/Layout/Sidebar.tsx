import {MouseEvent, useCallback} from 'react'
import {Button} from '../../components'
import {useLayoutContext} from '../../contexts/LayoutContext'
import * as C from '../../components/Layout/Sidebar'
import * as CN from './className'

export default function Sidebar() {
  const {setTestCnt} = useLayoutContext()

  const onClickSocketButtontConst = useCallback((e: MouseEvent) => {
    //
  }, [])

  return (
    <div className={CN.classNameEntireSidebar} style={{minWidth: '250px'}}>
      <div className="GKD_LIST_AREA">
        <C.ConferenceList />
        <C.ChattingList />
        <C.DocumentList />
      </div>
      <div className={CN.classNameTestButton}>
        <Button
          onClick={e => {
            setTestCnt(prev => prev + 1)
          }}>
          Just Increase
        </Button>
      </div>
      <div className={CN.classNameTestButton}>
        <Button onClick={onClickSocketButtontConst}>Socket Increase</Button>
      </div>
    </div>
  )
}
