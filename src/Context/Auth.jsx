import axios from 'axios';
import { createContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const navigate = useNavigate();
    const userRef = useRef(null);
    const isCheckingAuth = useRef(true); 
    // app load pe true hai
    // loading -> pehle check karo user looged in hai ya nhai -> agar hai to user data set karo -> agar nhai to user null set karo -> loading false set karo taki app render ho sake
    // App load hone pe check karo user looged in hai ?

    useEffect(() => {
        userRef.current = user;
    }, [user]);

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            async (error) => {
                if (error.response?.status === 401) {
                    if (!isRefreshing && !isCheckingAuth.current) {
                        setUser(null);
                        navigate('/login');
                    }
                }
                return Promise.reject(error);
            }
        );



        checkAuth();

        const interval = setInterval(() => {
            if (!userRef.current) return;
            if (isRefreshing) return;
            refreshToken();
        }, 14 * 60 * 1000);

        //visibility 

        const handlevisibilityChange = () => {
            if (document.visibilityState !== 'visible') return;
            if (userRef.current) {
                refreshToken();
            }
        };
        document.addEventListener('visibilitychange', handlevisibilityChange);

        return () => {
            clearInterval(interval)
            axios.interceptors.response.eject(interceptor);
            document.removeEventListener('visibilitychange', handlevisibilityChange)
        };
    }, []);

    async function fetchUser() {
        const res = await axios.get(`${API}/auth/is-auth`,
            { withCredentials: true }
        );
        if (res.data.success) {
            setUser(res.data.user);
        } else {
            setUser(null); // explicitly set null
        }

    }

    async function checkAuth() {
        const wasLoggedIn = localStorage.getItem('wasLoggedIn');
        isCheckingAuth.current = true;
        try {
            await fetchUser();
        } catch (error) {
            if(wasLoggedIn){

                try {
                    await axios.post(`${API}/auth/refresh-token`,
                        {},
                        { withCredentials: true });
                    await fetchUser();  // retry after refresh token 
                } catch {
                    localStorage.removeItem('wasLoggedIn');
                    setUser(null);
                }
            }else{
                setUser(null)
            }

        } finally {
            isCheckingAuth.current = false;
            setLoading(false);
        }
    }


    async function refreshToken() {
        if (isRefreshing) return; // already refreshing, skip
        setIsRefreshing(true);

        try {
            await axios.post(
                `${API}/auth/refresh-token`,
                {},
                { withCredentials: true }
            );
            await fetchUser();

        } catch (error) {
            const status = error.response?.status;
            if (status === 401 || status === 403) {
                if (userRef.current) {
                    setUser(null);
                    navigate('/');
                }
            }
        }
        finally {
            setIsRefreshing(false);
        }
    }

    //login page
    async function login(formData) {
        try {
            const res = await axios.post(
                `${API}/auth/login`,
                formData,
                { withCredentials: true }
            );
            if (res.data.success) {
                localStorage.setItem('wasLoggedIn', 'true')
                setUser(res.data.user); // user state update karo 
                return { success: true, data: res.data };
            }

        } catch (error) {
            const message = error.response?.data?.message || "Login failed";
            return { success: false, message };
        }
    }
    //register page
    async function register(formData) {
        try {
            const res = await axios.post(
                `${API}/auth/register`,
                formData,
                { withCredentials: true }
            );
            return { success: true, data: res.data };
        } catch (error) {
            const data = error.response?.data;
            return {
                success: false,
                message: data?.message || "Register failed",
                errors: data?.errors || null
            }
        }
    }

    //logout state
    async function logout() {
        try {
            await axios.post(
                `${API}/auth/logout`,
                {},
                { withCredentials: true }
            );
            localStorage.removeItem('wasLoggedIn');
        } catch (error) {
            console.warn("logout backend error: ", error.response?.data?.message)
        }
        setUser(null); //user clear karo
        navigate('/');
    }
    return (
        <AuthContext.Provider value={{ user, loading, isRefreshing, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    )
}

