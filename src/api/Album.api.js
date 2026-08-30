// api/album.api.js
// Saare album-related API calls yahan centralize kiye gaye hain.
// Components sirf inko call karte hain, axios/URL logic ab yahan hai.

import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

/**
 * GET /music/get-album?page=&limit=
 * Paginated list of albums (used in Album.jsx grid page)
 */
export function getAlbums(page = 1, limit = 10) {
  return axios.get(`${API}/music/get-album`, {
    params: { page, limit },
    withCredentials: true,
  });
}

/**
 * GET /music/get-album/:albumId
 * Single album with its songs (used in AlbumDetails.jsx)
 */
export function getAlbumById(albumId) {
  return axios.get(`${API}/music/get-album/${albumId}`, {
    withCredentials: true,
  });
}

