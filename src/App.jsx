import React, { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './Context/Theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pageloder from './Components/Pageloder';
import { AuthProvider } from './Context/Auth';
import ProtectedRoute from './Components/ProtectedRoute';

const Unauthorized = React.lazy(() => import('./pages/Unauthorized'));
const UserDashboard = React.lazy(() => import('./pages/UserDashboard'));
const CreateMusic = React.lazy(() => import('./pages/CreateMusic'));
const LocalFeed = React.lazy(() => import('./pages/LocalFeed'));
const YourPost = React.lazy(() => import('./pages/YourPost'));
const About = React.lazy(() => import('./pages/About'));
const Album = React.lazy(() => import('./pages/Album'));
const Authpage = React.lazy(() => import('./pages/AuthPage'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const LandingPage = React.lazy(() => import('./assets/LandingPage'))


function AppContent() {


  return (

    <Suspense fallback={<Pageloder />}>
      <Toaster
        position="top-left"
        reverseOrder={false}
      />
      <Routes>
        {/* public Routes */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
        {/*  login Page */}
        <Route path='/login' element={<Authpage />} />

        {/* Portected routes */}


        {/* Artist Dashboard */}
        <Route path='/artist-Dashboard' element={
          <ProtectedRoute allowedRole="artist">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/*  User Dashboard */}
        <Route path='/user-Dashboard' element={
          <ProtectedRoute allowedRole="user">
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path='/create-music' element={
          <ProtectedRoute>
            <CreateMusic />
          </ProtectedRoute>

        } />
        <Route path='/Local-feed' element={
          <ProtectedRoute>
            <LocalFeed />
          </ProtectedRoute>

        } />

        <Route path='/your-post' element={
          <ProtectedRoute>
            <YourPost />
          </ProtectedRoute>
        } />

        <Route path='/about' element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        } />

        <Route path='/album' element={
          <ProtectedRoute>
            <Album />
          </ProtectedRoute>
        } />
      </Routes>
    </Suspense>
  );
}
function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}
export default App