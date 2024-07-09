import {Routes, Route} from 'react-router-dom'
import Layout from './Layout'
import RootPage from '../pages/RootPage'
import NullPage from '../pages/NullPage'
import SignUpPage from '../pages/SignUpPage'
import {LayoutProvider} from '../contexts/LayoutContext'

export default function RoutesSetup() {
  return (
    <Routes>
      <Route path="/" element={<RootPage />}></Route>
      <Route
        path="/main"
        element={
          <LayoutProvider>
            <Layout />
          </LayoutProvider>
        }></Route>
      <Route path="/signup" element={<SignUpPage />}></Route>
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
