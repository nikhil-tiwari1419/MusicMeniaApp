import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export function getArtist() {
    return axios.get(`${API}/artist/get-artist`,{
        withCredentials:true
    })
} 

