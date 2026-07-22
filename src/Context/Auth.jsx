import axios from 'axios';
import { createContext, useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Sab refs — closure problem nahi hogi
    const userRef = useRef(null);
    const isRefreshingRef = useRef(false);
    const isCheckingAuthRef = useRef(true);
    const intervalRef = useRef(null);

    // User ref sync rakho
    useEffect(() => {
        userRef.current = user;
    }, [user]);

    //  Core Functions 
    const fetchUser = useCallback(async () => {
        const res = await axios.get(`${API}/auth/is-auth`, { withCredentials: true });
        if (res.data.success) {
            setUser(res.data.user);
            return res.data.user;
        }
        setUser(null);
        return null;
    }, []);

    const refreshToken = useCallback(async () => {
        // Guard — double refresh nahi hoga
        if (isRefreshingRef.current) return false;
        isRefreshingRef.current = true;

        try {
            await axios.post(`${API}/auth/refresh-token`, {}, { withCredentials: true });
            await fetchUser();
            return true; // success
        } catch (error) {
            const status = error.response?.status;
            if (status === 401 || status === 403) {
                // Refresh token bhi expire — logout karo
                localStorage.removeItem('wasLoggedIn');
                setUser(null);
                navigate('/login');
            }
            return false; // fail
        } finally {
            isRefreshingRef.current = false;
        }
    }, [fetchUser, navigate]);

    const checkAuth = useCallback(async () => {
        isCheckingAuthRef.current = true;
        const wasLoggedIn = localStorage.getItem('wasLoggedIn');

        try {
            // Pehle access token se try karo
            await fetchUser();
        } catch {
            if (wasLoggedIn) {
                // Access token expire — refresh try karo
                const refreshed = await refreshToken();
                if (!refreshed) {
                    // Refresh bhi fail — clean logout
                    localStorage.removeItem('wasLoggedIn');
                    setUser(null);
                }
            } else {
                // Kabhi login hi nahi kiya
                setUser(null);
            }
        } finally {
            isCheckingAuthRef.current = false;
            setLoading(false);
        }
    }, [fetchUser, refreshToken]);

    //  Silent Refresh Interval 

    const startSilentRefresh = useCallback(() => {
        // Pehle purana clear karo
        if (intervalRef.current) clearInterval(intervalRef.current);

        // Har 13 min pe refresh — 15 min se 2 min pehle
        intervalRef.current = setInterval(async () => {
            if (!userRef.current) return;
            if (isRefreshingRef.current) return;
            await refreshToken();
        }, 13 * 60 * 1000);
    }, [refreshToken]);

    //  Setup Effects 

    useEffect(() => {
        // Axios interceptor — 401 pe handle karo
        const interceptor = axios.interceptors.response.use(
            response => response,
            async (error) => {
                if (
                    error.response?.status === 401 &&
                    !isRefreshingRef.current &&
                    !isCheckingAuthRef.current
                ) {
                    // Silent refresh try karo ek baar
                    const refreshed = await refreshToken();
                    if (!refreshed) {
                        setUser(null);
                        navigate('/login');
                    }
                }
                return Promise.reject(error);
            }
        );

        // App load pe auth check
        checkAuth();

        // Silent refresh start karo
        startSilentRefresh();

        // Tab visible hone pe refresh karo
        const handleVisibilityChange = () => {
            if (document.visibilityState !== 'visible') return;
            if (!userRef.current) return;
            if (isRefreshingRef.current) return;
            refreshToken();
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(intervalRef.current);
            axios.interceptors.response.eject(interceptor);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    //  Auth Functions 

    async function login(formData) {
        try {
            const res = await axios.post(`${API}/auth/login`, formData, { withCredentials: true });
            // Backend success field check nahi karta — status 200 = success
            localStorage.setItem('wasLoggedIn', 'true');
            setUser(res.data.user);
            startSilentRefresh(); // Login ke baad interval reset karo
            return { success: true, data: res.data };
        } catch (error) {
            const data = error.response?.data;
            return {
                success: false,
                message: data?.message || "Login failed",
                errors: data?.errors || null
            };
        }
    }

    async function register(formData) {
        try {
            const res = await axios.post(`${API}/auth/register`, formData, { withCredentials: true });
            return { success: true, data: res.data };
        } catch (error) {
            const data = error.response?.data;
            return {
                success: false,
                message: data?.message || "Register failed",
                errors: data?.errors || null
            };
        }
    }

    async function logout() {
        try {
            await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
        } catch (error) {
            console.warn("Logout backend error:", error.response?.data?.message);
        } finally {
            localStorage.removeItem('wasLoggedIn');
            clearInterval(intervalRef.current);
            setUser(null);
            navigate('/');
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            register
        }}>
            {children}
        </AuthContext.Provider>
    );
};