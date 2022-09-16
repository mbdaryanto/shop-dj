import { Center, ChakraProvider, CircularProgress } from '@chakra-ui/react'
import { Suspense, lazy } from 'react'
import { HashRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import { RecoilRoot, useRecoilValue } from 'recoil'
import ErrorBoundary from './components/ErrorBoundary'
import LoginPage from './pages/Login'
import Navbar from './components/Navbar'
import { authStateAtom } from './components/auth'

const HomePage = lazy(() => import('./pages/Home'))
const ComingSoonPage = lazy(() => import('./pages/ComingSoon'))

const ItemPage = lazy(() => import('./pages/Item'))
const ItemCreatePage = lazy(() => import('./pages/ItemCreate'))
const ItemUpdatePage = lazy(() => import('./pages/ItemUpdate'))

const PurchasePage = lazy(() => import('./pages/Purchase'))
const PurchaseCreatePage = lazy(() => import('./pages/PurchaseCreate'))
const PurchaseUpdatePage = lazy(() => import('./pages/PurchaseUpdate'))

const App = () => (
  <ChakraProvider>
    <RecoilRoot>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={
                <HomePage/>
              } />
              <Route path="item">
                <Route index element={
                  <RequiredAuth>
                    <ItemPage/>
                  </RequiredAuth>
                }/>
                <Route path="create" element={
                  <RequiredAuth>
                    <ItemCreatePage/>
                  </RequiredAuth>
                }/>
                <Route path=":id/update" element={
                  <RequiredAuth>
                    <ItemUpdatePage/>
                  </RequiredAuth>
                }/>
              </Route>
              <Route path="purchase">
                <Route index element={
                  <RequiredAuth>
                    <PurchasePage/>
                  </RequiredAuth>
                }/>
                 <Route path="create" element={
                  <RequiredAuth>
                    <PurchaseCreatePage/>
                  </RequiredAuth>
                }/>
                <Route path=":id/update" element={
                  <RequiredAuth>
                    <PurchaseUpdatePage/>
                  </RequiredAuth>
                }/>
              </Route>
              <Route path="login">
                <Route index element={<LoginPage />}></Route>
              </Route>
            </Route>
          </Routes>
        </Router>
      </ErrorBoundary>
    </RecoilRoot>
  </ChakraProvider>
)

const MainLayout = () => (
  <Suspense fallback={(
    <Center h="100vh">
      <CircularProgress isIndeterminate/>
    </Center>
  )}>
    <Navbar>
      <Outlet />
    </Navbar>
  </Suspense>
)

function RequiredAuth({ children }: {
  children: JSX.Element,
}): JSX.Element {
  const auth = useRecoilValue(authStateAtom)
  const location = useLocation()

  if (!auth.isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default App;
