import axios from 'axios';
import { createContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // loading -> pehle check karo user looged in hai ya nhai 

    // App load hone pe check karo user looged in hai ?

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/is-auth`, { withCredentials: true }); // cookies bhejo

            if (res.data.success) {
                setUser(res.data.user); //userset karo
            }

        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    //login page
    async function login(formData) {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/login`,
            formData,
            { withCredentials: true }
        );
        setUser(res.data.user); // user state update karo 
        return res.data;
    }

    //register page
    async function register(formData) {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/register`,
            formData,
            { withCredentials: true }
        );
        return res.data;
    }


    //logout page
    async function logout() {
        await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/logout`,
            {},
            { withCredentials: true }
        );
        setUser(null); //user clear karo
    }
    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}