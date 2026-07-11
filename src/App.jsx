import React, { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './Context/Theme';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Pageloder from './Components/Pageloder';
import { AuthProvider } from './Context/Auth';
import ProtectedRoute from './Components/ProtectedRoute';
import { AudioProvider } from './Context/AudioContext';
import Mainlayout from './Ui/Mainlayout';


const Unauthorized = React.lazy(() => import('./pages/Unauthorized'));
const Authpage = React.lazy(() => import('./pages/AuthPage'));
const Forgotpass = React.lazy(() => import('./Components/ForgotPass'))
const LandingPage = React.lazy(() => import('./assets/LandingPage'));

// Admin page
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// Artist pages
const ArtistDashboard = React.lazy(() => import('./pages/Artistpage/ArtistDashboard'));
const Artist_Albums = React.lazy(() => import('./pages/Artistpage/AlbumsArtist'));
const CreateMusic = React.lazy(() => import('./pages/Artistpage/CreateMusic'));
const Mypost = React.lazy(() => import('./pages/Artistpage/Mypost'));
const Likedsong = React.lazy(() => import('./Components/Likedsong'));

// User pages
const UserDashboard = React.lazy(() => import('./pages/UserPage/UserDashboard'));
const LocalFeed = React.lazy(() => import('./pages/UserPage/LocalFeed'));
const About = React.lazy(() => import('./pages/UserPage/About'));
const Profile = React.lazy(() => import('./pages/UserPage/Profile'));
const Album = React.lazy(() => import('./pages/UserPage/Albums/Album'));
const AlbumDetail = React.lazy(() => import('./pages/UserPage/Albums/AlbumDetails'));
const Artist = React.lazy(() => import('./pages/UserPage/Artist'))
const Musicpanal = React.lazy(() => import('./Ui/MusicPanal'))


function AppContent() {
    return (
        <Suspense fallback={<Pageloder />}>
            <Toaster position="top-left" reverseOrder={false} />
            <Routes>

                {/* Router WITHOUT shared navbar/ Footer layout */}
                <Route path='/unauthorized' element={<Unauthorized />} />
                <Route path='/login' element={<Authpage />} />
                <Route path='/forgot-password' element={<Forgotpass />} />
                {/* Admin route */}
                <Route path='/admin-dashboard' element={
                    <ProtectedRoute allowedRole="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                
                {/* Now everything render it inside MainLyout's */}

                <Route element={<Mainlayout/>}>

                {/* Public routes */}
                <Route path='/' element={<LandingPage />} />


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

                <Route path='/Artist-album' element={
                    <ProtectedRoute allowedRole="artist">
                        <Artist_Albums />
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

                <Route path='/music_Panel' element={
                    <ProtectedRoute>
                        <Musicpanal />
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

                <Route path='/album/:albumId' element={
                    <ProtectedRoute>
                        <AlbumDetail />
                    </ProtectedRoute>
                } />

                <Route path='/liked-songs' element={
                    <ProtectedRoute>
                        <Likedsong />
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

                </Route>

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
                    <AudioProvider>
                        <AppContent />
                    </AudioProvider>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
