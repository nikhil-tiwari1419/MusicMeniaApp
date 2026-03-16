import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar';

function CreateMusic() {
  const navigate = useNavigate();

  const [musicPreview, setMusicPreview] = useState(null);
  const [filename, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [captionLength, setCaptionLength] = useState(0);
  const [loading, setLoading] = useState(false);

  const maxLength = 100;

  // Handles audio file selection
  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setMusicPreview(reader.result); // base64 audio preview
      };
      reader.readAsDataURL(file);
    }
  };

  // Tracks caption character count
  const handleCaptionChange = (e) => {
    setCaptionLength(e.target.value.length);
  };

  // Clears selected audio
  const clearAudio = () => {
    setMusicPreview(null);          // ✅ was setImagePreview (wrong state name)
    setFileName('');
    setSelectedFile(null);
    document.getElementById('file-upload').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();             // ✅ was e.preventdefault() — wrong casing
    setLoading(true);

    if (!selectedFile) {
      toast.error('Please select an audio file!'); // ✅ was GiToaster (not defined)
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);   // ✅ key must match multer's upload.single('file')
    formData.append('title', document.getElementById('caption').value);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/music/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'  // ✅ was 'multipart/from-data' (typo)
          },
          withCredentials: true  // sends cookie/token with request
        }
      );

      if (response.data.success || response.status === 201) {
        toast.success('Music created successfully 🎉');
        setMusicPreview(null);
        setFileName('');
        setSelectedFile(null);
        setCaptionLength(0);
        navigate('/');
      }

    } catch (error) {
      console.log('Error', error);
      const errorMessage = error.response?.data?.message || "Error creating music, please try again";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
      <section className='bg-gray-300 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center pt-4  sm:pt-10 lg:pt-8'>
        <div className='w-full max-w-2xl'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl text-gray-700 sm:text-4xl'>Create Audio</h1>
            <p className='text-gray-600 text-sm sm:text-base'>Share your feeling with the world</p>
          </div>

          <div className='bg-white rounded shadow-xl p-6 sm:p-8 lg:p-10'>
            <button
              onClick={() => navigate('/')}
              className='px-4 py-2 mb-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'>
              Back to Home
            </button>

            <form onSubmit={handleSubmit} className='flex flex-col gap-6'>

              {/* Audio Upload Section */}
              <div className='space-y-2'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Upload Music
                </label>

                {musicPreview ? (
                  <div className='relative'>
                    <audio
                      src={musicPreview}        // ✅ was setMusicPreview (setter function, not value)
                      controls
                      className='w-full rounded-xl'
                    />
                    <button
                      type='button'
                      onClick={clearAudio}
                      className='absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='8' d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                    <p className='mt-2 text-sm text-gray-600'>📁 {filename}</p>
                  </div>
                ) : (
                  <div className='relative'>
                    <input
                      type='file'
                      name="file"
                      accept='audio/*'
                      onChange={handleAudioChange}
                      className='hidden'
                      id='file-upload'
                      required
                    />
                    <label htmlFor="file-upload"
                      className='flex justify-center w-full h-64 sm:h-80 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors'>
                      <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                        <svg className='w-12 h-12 sm:w-16 sm:h-16 mb-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                        </svg>
                        <p className='text-sm mb-2 sm:text-base text-gray-600 font-medium'>Click to Upload or drag and drop</p>
                        <p className='text-sm text-gray-500'>MP3 , Up to 5MB</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Caption */}
              <div className='space-y-2'>
                <label htmlFor="caption" className='block text-sm font-semibold text-gray-700'>
                  Music Description 
                </label>
                <textarea
                  name="caption"
                  id="caption"
                  required
                  rows='2'
                  maxLength={maxLength}
                  placeholder='Write a description for your Audio...'
                  onChange={handleCaptionChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 placeholder-gray-400'
                />
                <p className={`text-xs ${captionLength > maxLength * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
                  {captionLength}/{maxLength} characters  {/* ✅ was setCaptionLength (setter, not value) */}
                </p>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type='submit'                   // ✅ was type='button' so form never submitted
                  disabled={loading}
                  className='w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                  {loading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    'Publish Music'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default CreateMusic
