import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../Components/Navbar';
import { useTheme } from '../../Context/Theme';

function CreateMusic() {
  const navigate = useNavigate();

  const [musicPreview, setMusicPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // added to select store iage in state
  const [captionLength, setCaptionLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [audioFileName, setAudioFileName] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [caption, setCaption] = useState(''); // added — no more getElementById
  const { theme } = useTheme();
  const dark = theme === "dark"

  const maxLength = 100;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10 Mb');
      e.target.value = '';
      return;
    }
    setImageFileName(file.name);
    setSelectedImage(file); //  save in state
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Audio File must be under 5mb');
      e.target.value = '';
      return;
    }
    setAudioFileName(file.name);
    setSelectedFile(file);
    setMusicPreview(URL.createObjectURL(file));
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);         //  save in state
    setCaptionLength(e.target.value.length);
  };

  const clearAudio = () => {
    setMusicPreview(null);
    setAudioFileName('');
    setSelectedFile(null);
    document.getElementById('file-upload').value = '';
  };

  const clearImg = () => {
    setImagePreview(null);
    setImageFileName('');
    setSelectedImage(null); //  clear state
  };

  const resetForm = () => {
    setMusicPreview(null);
    setImagePreview(null);
    setAudioFileName('');
    setImageFileName('');
    setSelectedFile(null);
    setSelectedImage(null); //  reset image state
    setCaptionLength(0);
    setCaption('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedFile) {
      toast.error('Please select an audio file!');
      setLoading(false);
      return;
    }

    if (!selectedImage) {
      toast.error('Please select a thumbnail!');
      setLoading(false);
      return;
    }

    if (!caption.trim()) {
      toast.error('Please add a description!');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('audio', selectedFile);
    formData.append('title', caption);        //  use state, not getElementById
    formData.append('thumbnail', selectedImage); //  use state, not getElementById

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/music/upload-music`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );

      if (response.data.success || response.status === 201) {
        toast.success('Music created successfully 🎉');
        resetForm(); //  clean reset
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || "Error creating music, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className={`${dark ? "bg-gray-800 text-white " : " text-black bg-gray-100"} min-h-screen  flex items-center justify-center pt-14 sm:pt-20 lg:pt-8`}>
        <div className='w-full max-w-2xl'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl  sm:text-4xl'>Create Audio</h1>
            <p className=' text-sm sm:text-base'>Share your feeling with the world</p>
          </div>

          <div className=' rounded shadow-xl p-6 sm:p-8 lg:p-10'>
            <button
              onClick={() => navigate('/')}
              className='px-4 py-2 mb-4 rounded-lg border transition-colors'>
              Back to Home
            </button>

            <form onSubmit={handleSubmit} className={`flex flex-col gap-6 `}>

              {/* Audio Upload */}
              <div className='space-y-2 '>
                <label className='block text-sm font-semibold mb-2'>
                  Upload Music
                </label>

                {musicPreview ? (
                  <div className='relative'>
                    <audio src={musicPreview} controls className='w-full rounded-xl' />
                    <button
                      type='button'
                      onClick={clearAudio}
                      className='absolute top-2 right-2 bg-red-500 p-2 rounded-full hover:bg-red-600 transition-colors'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='8' d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                    <p className={`mt-2 text-sm ${dark ? "text-blue-500":""}`}>📁 {audioFileName}</p>
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
                    />
                    <label htmlFor="file-upload"
                      className='flex justify-center w-full h-16 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors'>
                      <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                        <svg className='w-12 h-12 sm:w-16 sm:h-16 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                        </svg>
                        <p className='text-sm mb-2 sm:text-base  font-medium'>Click to Upload or drag and drop</p>
                        <p className='text-sm'>MP3, Up to 5MB</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div className='space-y-2'>
                <label className='block text-sm font-semibold '>
                  Upload Thumbnail
                </label>

                {imagePreview ? (
                  <div className='relative'>
                    <img src={imagePreview} alt="Thumbnail Preview" className='w-full h-64 object-cover rounded-xl' />
                    <button
                      type='button'
                      onClick={clearImg}
                      className='absolute top-2 right-2 bg-red-500 p-2 rounded-full hover:bg-red-600 transition-colors'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                    <p className={`mt-2 text-sm ${dark ? "text-blue-500":""}`}>📁 {imageFileName}</p>
                  </div>
                ) : (
                  <div className='relative'>
                    <input
                      type='file'
                      name="thumbnail"
                      accept='image/*'
                      onChange={handleImageChange}
                      className='hidden'
                      id='thumbnail-upload'
                    />
                    <label
                      htmlFor='thumbnail-upload'
                      className='flex justify-center w-full h-64 sm:h-80 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors'>
                      <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                        <svg className='w-16 h-16 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                        </svg>
                        <p className='mb-2 text-sm sm:text-base font-medium'>Click to upload or drag and drop</p>
                        <p className='text-xs sm:text-sm'>PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Caption */}
              <div className='space-y-2'>
                <label htmlFor="caption" className='block text-sm font-semibold '>
                  Music Description
                </label>
                <textarea
                  name="caption"
                  id="caption"
                  rows='2'
                  maxLength={maxLength}
                  value={caption}
                  placeholder='Write a description for your Audio...'
                  onChange={handleCaptionChange}    //  uses state
                  className='w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none  placeholder-gray-400'
                />
                <p className={`text-xs ${captionLength > maxLength * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
                  {captionLength}/{maxLength} characters
                </p>
              </div>

              {/* Submit */}
              <div>
                <button
                  type='submit'
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

