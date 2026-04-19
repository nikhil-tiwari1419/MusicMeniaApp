import axios from 'axios';
import { createContext, useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userRef = useRef(null);

    // loading -> pehle check karo user looged in hai ya nhai -> agar hai to user data set karo -> agar nhai to user null set karo -> loading false set karo taki app render ho sake
    // App load hone pe check karo user looged in hai ?

    useEffect(() => {
        userRef.current = user;
    }, [user]);
    useEffect(() => {
        checkAuth();
        const interval = setInterval(() => {
            if (!userRef.current) return;
            refreshToken();
        }, 14 * 60 * 1000);

        return () => clearInterval(interval);
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
        try {
            await fetchUser();
        } catch (error) {
            try {
                //access tken is expire try to refresh
                await axios.post(`${API}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );
                await fetchUser();  // retry after refresh token 
            } catch {
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    }
    async function refreshToken() {
        try {
            await axios.post(
                `${API}/auth/refresh-token`,
                {},
                { withCredentials: true }
            );
            await fetchUser(); // token refresh hone ke baad user data fetch karo taki latest user state mile
        } catch {
            if (userRef.current) {
                setUser(null);
                navigate('/');
            }
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
            setUser(res.data.user); // user state update karo 
            return { success: true, data: res.data };

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
            const message = error.response?.data;
            return {
                success: false,
                message: data?.message || "Register failed",
                errors: data?.erors || null 
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
        } catch (error) {
            console.warn("logout backend error: ", error.response?.data?.message)
        }
        setUser(null); //user clear karo
        navigate('/');
    }
    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    )
}

