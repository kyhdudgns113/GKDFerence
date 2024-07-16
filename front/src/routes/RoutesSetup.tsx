import {Routes, Route} from 'react-router-dom'
import NullPage from '../pages/NullPage'
import MainPage from '../pages/MainPage'
import RequireAuth from '../providers/RequireAuth'

import * as CT from '../contexts'
import SingleChatPage from '../pages/SingleChatPage'

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
        <Route path="/main/sc" element={<SingleChatPage />} />
        <Route path="/main/*" element={<NullPage />} />
      </Route>
      <Route path="/signup" element={<CT.SignUpProvider />}></Route>
      <Route path="/*" element={<NullPage />}></Route>
    </Routes>
    // <Routes>
    //   <Route path="/" element={<Layout />}>
    //     <Route index element={<LandingPage />} />
    //     <Route
    //       path="/board"
    //       element={
    //         <RequireAuth>
    //           <Board />
    //         </RequireAuth>
    //       }
    //     />
    //     <Route path="*" element={<NoMatch />} />
    //   </Route>
    //   <Route path="/signup" element={<Signup />} />
    //   <Route path="/login" element={<Login />} />
    //   <Route
    //     path="/logout"
    //     element={
    //       <RequireAuth>
    //         <Logout />
    //       </RequireAuth>
    //     }
    //   />
    //   <Route path="*" element={<NoMatch />} />
    // </Routes>
  )
}
