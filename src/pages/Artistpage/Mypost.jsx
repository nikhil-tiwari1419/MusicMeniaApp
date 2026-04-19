import React, { useEffect, useState } from 'react'
import { useTheme } from '../../Context/Theme';
import Musics from '../../Components/Musics';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from "axios"

function Mypost() {
  const API = import.meta.env.VITE_API_URL;
  const [load, setLoad] = useState(true);
  const [musics, setMusics] = useState([]);
  const [error, setError] = useState(null);

  const { theme } = useTheme();
  const dark = theme === "dark";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMusics = async () => {
      try {
        setLoad(true);
        const response = await axios.get(`${API}/music/get-music`, {
          withCredentials: true
        });
        console.log("API Response ", response.data);
        if (response.data.musics) {
          setMusics(response.data.musics);
        } else {
          console.log("Unexpected response sahpe:")
        }
      } catch (error) {
        console.log("Fetch error:")
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoad(false);
      }
    };
    fetchMusics();
  }, []);

  const handelDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await axios.delete(`${API}/music/delete-music/${postId}`, {
        withCredentials: true
      });
      if (response.data.success) {
        setMusics(musics.filter(post => post._id !== postId));
        toast.success('Music deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete music');
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${dark ? "bg-gray-800 text-white" : "bg-gray-50 text-black"}`}>
      {/* fixed min-h-Screen → min-h-screen */}

      <div className='max-w-7xl mx-auto mb-4'>
        <h1 className='py-4 text-center sm:text-4xl text-2xl font-bold'>Music's</h1>
      </div>

      <button className='px-2 bg-blue-100 rounded-xl my-2'

        onClick={() => navigate('/artist-Dashboard')}>Back</button>
      <div className='max-w-7xl mx-auto'>

        {/* Error */}
        {error && (
          <div className='text-center text-red-500'>
            <p className='text-red-600'>Error: {error}</p>
          </div>
        )}

        {/* Empty state */}
        {!load && !error && musics.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500 mb-4'>No posts Yet</p>
            <button
              onClick={() => navigate('/create-post')}
              className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'>
              Create Post
            </button>
          </div>
        )}

        {/* Music Grid */}
        {!load && !error && musics.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {musics.map((musics) => (
              <div
                key={musics._id}
                className={`border ${dark ? "border-gray-200" : "border-gray-800"}`}
              >
                <Musics musics={musics} onDelete={handelDelete} /> {/* ✅ props passed */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Mypost

