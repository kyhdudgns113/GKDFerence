import {Routes, Route} from 'react-router-dom'
import NullPage from '../pages/NullPage/NullPage'
import MainPage from '../pages/MainPage/MainPage'
import RequireAuth from '../providers/RequireAuth'

import * as CT from '../contexts'

export default function RoutesSetup() {
  return (
    <Routes>
      <Route path="/" element={<CT.RootPageProvider />}></Route>
      <Route
        path="/main"
        element={
          <RequireAuth>
            <CT.LayoutProvider />
          </RequireAuth>
        }>
        <Route index element={<MainPage />} />
        <Route path="/main/sc/:cOId" element={<CT.SingleChatProvider />} />
        <Route path="/main/*" element={<NullPage />} />
      </Route>
      <Route path="/signup" element={<CT.SignUpProvider />} />
      <Route path="/*" element={<NullPage />}></Route>
    </Routes>
  )
}
