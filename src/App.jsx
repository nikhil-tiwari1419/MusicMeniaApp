import React, { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './Context/Theme';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Pageloder from './Components/Pageloder';
import { AuthProvider } from './Context/Auth';
import ProtectedRoute from './Components/ProtectedRoute';


const Unauthorized = React.lazy(() => import('./pages/Unauthorized'));
const Authpage = React.lazy(() => import('./pages/AuthPage'));
const Forgotpass = React.lazy(() => import('./Components/ForgotPass'))
const LandingPage = React.lazy(() => import('./assets/LandingPage'));

// Admin page
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// Artist pages
const ArtistDashboard = React.lazy(() => import('./pages/Artistpage/ArtistDashboard'));
const Albums = React.lazy(() => import('./pages/Artistpage/Albums'));
const CreateMusic = React.lazy(() => import('./pages/Artistpage/CreateMusic'));
const Mypost = React.lazy(() => import('./pages/Artistpage/Mypost'));

// User pages
const UserDashboard = React.lazy(() => import('./pages/UserPage/UserDashboard'));
const LocalFeed = React.lazy(() => import('./pages/UserPage/LocalFeed'));
const About = React.lazy(() => import('./pages/UserPage/About'));
const Album = React.lazy(() => import('./pages/UserPage/Album'));
const Profile = React.lazy(() => import('./pages/UserPage/Profile'));
const Artist = React.lazy(()=> import('./pages/UserPage/Artist'))


function AppContent() {
    return (
        <Suspense fallback={<Pageloder />}>
            <Toaster position="top-left" reverseOrder={false} />
            <Routes>

                {/* Public routes */}
                <Route path='/' element={<LandingPage />} />
                <Route path='/unauthorized' element={<Unauthorized />} />
                <Route path='/login' element={<Authpage />} />
                <Route path='/forgot-password' element={<Forgotpass />} />

                {/* Admin route */}
                <Route path='/admin-dashboard' element={
                    <ProtectedRoute allowedRole="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                {/* Artist routes */}
                <Route path='/artist-Dashboard' element={
                    <ProtectedRoute allowedRole="artist">
                        <ArtistDashboard />  {/* renamed */}
                    </ProtectedRoute>
                } />

                <Route path='/create-music' element={
                    <ProtectedRoute allowedRole="artist">
                        <CreateMusic />
                    </ProtectedRoute>
                } />

                <Route path='/your-post' element={
                    <ProtectedRoute allowedRole="artist">
                        <Mypost />
                    </ProtectedRoute>
                } />

                <Route path='/Admin-album' element={
                    <ProtectedRoute allowedRole="artist">
                        <Albums />
                    </ProtectedRoute>
                } />

                {/* User routes */}
                <Route path='/user-Dashboard' element={
                    <ProtectedRoute allowedRole="user">
                        <UserDashboard />
                    </ProtectedRoute>
                } />

                <Route path='/Local-feed' element={
                    <ProtectedRoute>
                        <LocalFeed />
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

                <Route path='/Profile' element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />

                <Route path='/artist' element={
                    <ProtectedRoute>
                        <Artist />
                    </ProtectedRoute>
                } />
                <Route path='*' element={<Navigate to="/" />} />
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
    );
}

export default App;
