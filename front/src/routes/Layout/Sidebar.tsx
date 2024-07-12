import {useState} from 'react' // eslint-disable-line

import {TestButton} from '../../components'

import * as CT from '../../contexts'
import * as C from '../../components/Layout/Sidebar'
import * as CN from './className'
import {SocketTestCountType} from '../../common'

export default function Sidebar() {
  const {testCnt, setTestCnt} = CT.useLayoutContext()
  const {socketP} = CT.useSocketContext()

  const {id, checkToken, refreshToken} = CT.useAuth()

  const {onTestOpen} = CT.useLayoutModalContext()

  return (
    <div className={CN.classNameEntireSidebar} style={{minWidth: '250px'}}>
      <div className="GKD_LIST_AREA">
        <C.ConferenceList />
        <C.ChattingList />
        <C.DocumentList />
      </div>
      <div className="GKD_TestBtn_Area flex flex-col items-center justify-center mt-2">
        <TestButton onClick={e => setTestCnt(prev => prev + 1)}>Inc</TestButton>
        <TestButton
          onClick={e => {
            if (socketP) {
              const sendObj: SocketTestCountType = {
                id: id || '',
                cnt: testCnt || 0
              }
              socketP.emit('test count', sendObj)
            } else {
              console.log('Why not socket in Sidebar')
            }
          }}>
          Sock Inc
        </TestButton>
        <TestButton onClick={e => checkToken()}>Token C</TestButton>
        <TestButton onClick={e => refreshToken()}>Token R</TestButton>
        <TestButton onClick={e => onTestOpen()}>Test Modal</TestButton>
      </div>
    </div>
  )
}
