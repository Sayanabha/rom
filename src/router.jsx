import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Splash      from './pages/Splash'
import Login       from './pages/Auth/Login'
import Signup      from './pages/Auth/Signup'
import Feed        from './pages/Feed'
import Discover    from './pages/Discover'
import Matches     from './pages/Matches'
import Chat        from './pages/Chat'
import ChatRoom    from './pages/ChatRoom'
import Profile     from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Games       from './pages/Games'
import Settings    from './pages/Settings'

function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

function PublicRoute() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return !isAuthenticated ? <Outlet /> : <Navigate to="/feed" replace />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Splash />,
  },
  {
    element: <PublicRoute />,
    children: [
      { path: '/login',  element: <Login /> },
      { path: '/signup', element: <Signup /> },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      { path: '/feed',          element: <Feed /> },
      { path: '/discover',      element: <Discover /> },
      { path: '/matches',       element: <Matches /> },
      { path: '/chat',          element: <Chat /> },
      { path: '/chat/:matchId', element: <ChatRoom /> },
      { path: '/profile',       element: <Profile /> },
      { path: '/profile/edit',  element: <EditProfile /> },
      { path: '/games',         element: <Games /> },
      { path: '/settings',      element: <Settings /> },
    ],
  },
])