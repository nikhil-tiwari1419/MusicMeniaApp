import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

axios.defaults.withCredentials = true;

export const AppContextProvider = (props) =>{
    const backendUrl  =import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const getAuthState = async ()=>{
        try {
            const res = await axios.get(backendUrl + '/api/auth/')
        } catch (error) {
            
        }
    }
}