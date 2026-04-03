import React, { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './Context/Theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pageloder from './Components/Pageloder';
import { AuthProvider } from './Context/Auth';
import ProtectedRoute from './Components/ProtectedRoute';

const Unauthorized = React.lazy(() => import('./pages/Unauthorized'));
const Authpage = React.lazy(() => import('./pages/AuthPage'));
const LandingPage = React.lazy(() => import('./assets/LandingPage'));

// Artist Pages
const AdminDashboard = React.lazy(() => import('./pages/Artistpage/AdminDashboard'));
const Albums = React.lazy(() => import('./pages/Artistpage/Albums'));
const CreateMusic = React.lazy(() => import('./pages/Artistpage/CreateMusic'));
const Mypost = React.lazy(() => import('./pages/Artistpage/Mypost'));

// User Pages
const UserDashboard = React.lazy(() => import('./pages/UserPage/UserDashboard'));
const LocalFeed = React.lazy(() => import('./pages/UserPage/LocalFeed'));
const About = React.lazy(() => import('./pages/UserPage/About'));
const Album = React.lazy(() => import('./pages/UserPage/Album'));
const Profile = React.lazy(() => import('./pages/UserPage/Profile'));




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
            <Mypost />
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