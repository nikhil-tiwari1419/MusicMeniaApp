import React, { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { NavLink } from "react-router-dom";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
    Outlet,
} from "react-router-dom";

import { ThemeProvider } from "./Context/Theme";
import { AuthProvider } from "./Context/Auth";
import { AudioProvider } from "./Context/AudioContext";

import ProtectedRoute from "./Components/ProtectedRoute";
import Pageloder from "./Components/Pageloder";
import Mainlayout from "./Ui/Mainlayout";

// Lazy Loaded Pages

// ---------- Public Pages ----------
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const Authpage = lazy(() => import("./pages/AuthPage"));
const Forgotpass = lazy(() => import("./Components/ForgotPass"));
const LandingPage = lazy(() => import("./assets/LandingPage"));
const PrivacyPolicy = lazy(() => import("./pages/PolicyPage"));
const TermsOfService = lazy(() => import("./pages/TermsofServise"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

// ---------- Admin ----------
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// ---------- Artist ----------
const ArtistDashboard = lazy(() =>
    import("./pages/Artistpage/ArtistDashboard")
);

const Artist_Albums = lazy(() =>
    import("./pages/Artistpage/AlbumsArtist")
);

const CreateMusic = lazy(() =>
    import("./pages/Artistpage/CreateMusic")
);

const Mypost = lazy(() =>
    import("./pages/Artistpage/Mypost")
);

// ---------- User ----------
const UserDashboard = lazy(() =>
    import("./pages/UserPage/UserDashboard")
);

const LocalFeed = lazy(() =>
    import("./pages/UserPage/LocalFeed")
);

const About = lazy(() =>
    import("./pages/UserPage/About")
);

const Profile = lazy(() =>
    import("./pages/UserPage/Profile")
);

const Album = lazy(() =>
    import("./pages/UserPage/Albums/Album")
);

const AlbumDetail = lazy(() =>
    import("./pages/UserPage/Albums/AlbumDetails")
);

const Artist = lazy(() =>
    import("./pages/UserPage/Artist")
);

const Musicpanal = lazy(() =>
    import("./Ui/MusicPanal")
);

const Likedsong = lazy(() =>
    import("./Components/Likedsong")
);

// App Providers

function AppProviders() {
    return (
        <AuthProvider>
            <AudioProvider>

                {/* Toast Notifications */}
                <Toaster
                    position="top-left"
                    reverseOrder={false}
                />

                {/* Lazy Loading */}
                <Suspense fallback={<Pageloder />}>
                    <Outlet />
                </Suspense>

            </AudioProvider>
        </AuthProvider>
    );
}

// React Router

const AppContent = createBrowserRouter([
    {
        element: <AppProviders />,
        errorElement: <div> <Unauthorized />Something went wrong. <NavLink to="/" className={"border p-3 m-2 rounded "}>Go home</NavLink></div>,
        children: [

            // Routes WITHOUT Mainlayout

            {
                path: "/unauthorized",
                element: <Unauthorized />,
            },

            {
                path: "/login",
                element: <Authpage />,
            },

            {
                path: "/forgot-password",
                element: <Forgotpass />,
            },

            // Admin

            {
                path: "/admin-dashboard",
                element: (
                    <ProtectedRoute allowedRole="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                ),
            },

            // Main Layout

            {
                element: <Mainlayout />,
                children: [

                    // Public Routes

                    {
                        index: true,
                        element: <LandingPage />,
                    },

                    {
                        path: "pp",
                        element: <PrivacyPolicy />,
                    },

                    {
                        path: "tos",
                        element: <TermsOfService />,
                    },

                    {
                        path: "contact",
                        element: <ContactPage />,
                    },

                    // Artist Routes

                    {
                        path: "artist-dashboard",
                        element: (
                            <ProtectedRoute allowedRole="artist">
                                <ArtistDashboard />
                            </ProtectedRoute>
                        ),
                    },

                    {
                        path: "create-music",
                        element: (
                            <ProtectedRoute allowedRole="artist">
                                <CreateMusic />
                            </ProtectedRoute>
                        ),
                    },

                    {
                        path: "your-post",
                        element: (
                            <ProtectedRoute allowedRole="artist">
                                <Mypost />
                            </ProtectedRoute>
                        ),
                    },

                    {
                        path: "artist-album",
                        element: (
                            <ProtectedRoute allowedRole="artist">
                                <Artist_Albums />
                            </ProtectedRoute>
                        ),
                    },

                    // User Routes

                    {
                        path: "user-dashboard",
                        element: (
                            <ProtectedRoute allowedRole="user">
                                <UserDashboard />
                            </ProtectedRoute>
                        ),
                    },

                    {
                        path: "local-feed",
                        element: (
                            <ProtectedRoute>
                                <LocalFeed />
                            </ProtectedRoute>
                        ),
                    },

                    {
                        path: "music_panel",
                        element: (
                            <ProtectedRoute>
                                <Musicpanal />
                            </ProtectedRoute>
                        ),
                    },

                    {
                        path: "about",
                        element: (
                            <ProtectedRoute>
                                <About />
                            </ProtectedRoute>
                        ),
                    },

                    {
                        path: "album",
                        element: (
                            <ProtectedRoute>
                                <Album />
                            </ProtectedRoute>
                        ),
                    },

                    {
                        path: "album/:albumId",
                        element: (
                            <ProtectedRoute>
                                <AlbumDetail />
                            </ProtectedRoute>
                        ),
                    },

                    {
                        path: "liked-songs",
                        element: (
                            <ProtectedRoute>
                                <Likedsong />
                            </ProtectedRoute>
                        ),
                    },

                    {
                        path: "profile",
                        element: (
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        ),
                    },

                    {
                        path: "artist",
                        element: (
                            <ProtectedRoute>
                                <Artist />
                            </ProtectedRoute>
                        ),
                    },
                ],
            },

            // 404 RANDOME PATH WHICH NOT EXIST IN APP

            {
                path: "*",
                element: <Navigate to="/" replace />,
            },
        ],
    },
]);

// App

function App() {
    return (
        <ThemeProvider>
            <RouterProvider router={AppContent} />
        </ThemeProvider>
    );
}

export default App;

