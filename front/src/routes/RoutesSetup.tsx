import {Routes, Route} from 'react-router-dom'
import NullPage from '../pages/NullPage'
import MainPage from '../pages/MainPage'
import {LayoutProvider} from '../contexts/LayoutContext'
import {SignUpProvider} from '../contexts/SignUpContext'
import {RootPageProvider} from '../contexts/RootPageContext'
import RequireAuth from '../providers/RequireAuth'

export default function RoutesSetup() {
  return (
    <Routes>
      <Route path="/" element={<RootPageProvider />}></Route>
      <Route
        path="/main"
        element={
          <RequireAuth>
            <LayoutProvider />
          </RequireAuth>
        }>
        <Route index element={<MainPage />} />
      </Route>
      <Route path="/signup" element={<SignUpProvider />}></Route>
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
