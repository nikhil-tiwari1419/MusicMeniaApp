import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export async function fetchMusicPage({ pageParam = 1, limit = 10 }) {
    const res = await axios.get(
        `${API}/music/get-music`,
        {
            params: { page: pageParam, limit },
            withCredentials: true,
        }
    );
    return res.data; // { musics: [...], pagination: { page, totalPages, total } }
}

