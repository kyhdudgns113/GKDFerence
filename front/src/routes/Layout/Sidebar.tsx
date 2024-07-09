import {MouseEvent, useCallback} from 'react'
import {Button} from '../../components'
import {Text} from '../../components/Layout/Header'
import {useLayoutContext} from '../../contexts/LayoutContext'

export default function Sidebar() {
  const {setTestCnt} = useLayoutContext() // eslint-disable-line

  const onClickSocketButtontConst = useCallback((e: MouseEvent) => {
    //
  }, [])

  return (
    <div className="w-24" style={{minWidth: '200px'}}>
      <div className="GKD_LISTs">
        <div>
          <Text>&nbsp;&nbsp;Conference List</Text>
        </div>
        <div>
          <Text>&nbsp;&nbsp;Chatting List</Text>
        </div>
        <div>
          <Text>&nbsp;&nbsp;Document List</Text>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-4">
        <Button
          onClick={e => {
            setTestCnt(prev => prev + 1)
          }}>
          Just Increase
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center mt-4">
        <Button onClick={onClickSocketButtontConst}>Socket Increase</Button>
      </div>
    </div>
  )
}
