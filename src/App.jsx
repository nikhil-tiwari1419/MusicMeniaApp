import React, { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './Context/Theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pageloder from './Components/Pageloder';
import { AuthProvider } from './Context/Auth';
import ProtectedRoute from './Components/ProtectedRoute';

const HomeMusic = React.lazy(() => import('./pages/HomeMusic'));
const CreateMusic = React.lazy(() => import('./pages/CreateMusic'));
const LocalFeed = React.lazy(() => import('./pages/LocalFeed'));
const YourPost = React.lazy(() => import('./pages/YourPost'));
const About = React.lazy(() => import('./pages/About'));
const Album = React.lazy(() => import('./pages/Album'));


function AppContent() {


  return (

    <Suspense fallback={<Pageloder />}>

      <Router>
        <Toaster
          position="top-left"
          reverseOrder={false}
        />
        <Routes>
          {/* public Routes */}

          {/* <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} /> */}

          {/* Portected routes */}
          <Route path='/' element={
            <ProtectedRoute>
              <HomeMusic />
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
      </Router>
    </Suspense>

  );
}
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}
export default App