import axios from 'axios';
import { createContext, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    // loading -> pehle check karo user looged in hai ya nhai 

    // App load hone pe check karo user looged in hai ?

    useEffect(() => {
        checkAuth();

    }, []);

    useEffect(() => {
        if (!user) return;

        const interval = setInterval(refreshToken, 14 * 60 * 1000); // 14 min ke baad token refresh karna hai
        return () => clearInterval(interval);
    }, [user])

    async function fetchUser() {
        const res = await axios.get(`${API}/auth/is-auth`,
            { withCredentials: true }
        );
        if (res.data.success) setUser(res.data.user);
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
            } catch (error) {
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
            )
        } catch (error) {
            if (user) {
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
            const message = error.response?.data?.message || "Registration failed";
            return { success: false, message }
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
        <AuthContext.Provider value={{ user, loading, login, logout, register, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

