import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useTheme } from '../../Context/Theme'
import { Upload, Music, Image, FileText, ArrowLeft, Loader2, X, Play, Pause, Form } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL;

function CreateMusic() {
  const path = useNavigate();
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [musicPreview, setMusicPreview] = useState(null);
  const [imagePreview, setImagepriview] = useState(null);
  const [selectedfile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setloading] = useState(false);
  const [audioFileName, setAudioFileName] = useState('');
  const [imageFileName, setImageFileName] = useState('');

  //custum audio preview state --

  const audioRef = useRef(null);
  const [isPreviewPlaying, setisPreviewPlaying] = useState(false);

  const maxlenth = 100; // this is for caption text 

  // image handle
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // image validation 
    if (file.size > 1 * 1024 * 1024) {
      toast.error('Image must be under 1 MB'); return;
    }
    setImageFileName(file.name);
    setSelectedImage(file);
    setImagepriview(URL.createObjectURL(file));
    // these method will disaply the image in Ui 
  };

  // audio handle
  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAudioFileName(file.name);
    setSelectedFile(file);
    setMusicPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
    setisPreviewPlaying(false)
  }, [musicPreview]);

  // toggle preview play 
  // const togglePreviewPlay = ()=> {
  function togglePriviewPlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setisPreviewPlaying(true);
    } else {
      audio.pause();
      setisPreviewPlaying(false);
    }
  }

  // clear audio
  const clearAudio = () => {
    setMusicPreview(null);
    setAudioFileName('');
    setSelectedFile(null);
    setisPreviewPlaying(false)
    document.getElementById('file-upload').value = '';
  }

  //clear image
  const clearImage = () => {
    setImagepriview(null);
    setImageFileName('');
    setSelectedImage(null)
  }

  // clear form 
  const resetForm = () => {
    setMusicPreview(null);
    setImagepriview(null);
    setAudioFileName('');
    setImageFileName('')
    setSelectedFile(null);
    setSelectedImage(null);
    setCaption('');
    setisPreviewPlaying(false);
  }

  //api call,  post API call to upload music
  const handleSubmit = async (e) => {
    e.preventDefault(); //stop refrresh when submitting filess
    if (!selectedfile) {
      toast.error('Please select an audio file'); return;
    }
    if (!caption.trim()) {
      toast.error('Please add a title'); return;
    }

    setloading(true);
    const formData = new FormData();
    formData.append('audio', selectedfile);
    formData.append('title', caption);
    if (selectedImage) formData.append('thumbnail', selectedImage);

    try {
      const response = await axios.post(
        `${API}/music/upload-music`, formData,
        {
          headers: { 'Content-type': 'multipart/form-data' },
          withCredentials: true
        }
      );

      if (response.data.success || response.status === 201) {
        toast.success('Music Uploaded Successfully 🎉.', {
          style: {
            border: '1px solid #713200',
            padding: '16px',
            color: '#713200',
          },
          iconTheme: {
            primary: '#713200',
            secondary: '#FFFAEE',
          },
        });
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload fialed Please try again");
    } finally {
      setloading(false);
    }
  };


  //UI part
  const bg = dark ? 'bg-neutral-950' : 'bg-white';
  const text = dark ? 'text-neutral-100' : 'text-neutral-900';
  const sub = dark ? 'text-neutral-500' : 'text-neutral-400';
  const card = `rounded-xl border transition-colors ${dark ? 'bg-neutral-900 ' : 'bg-gray-100 border-2 border-neutral-800'}`;
  const eyebrow = `text-[11px] font-semibold uppercase tracking-[0.14em] flex items-center gap-2`;

  return (
    <main className={`min-h-screen pt-5 pb-16 px-4 ${text} ${bg}`}>
      <div className='max-w-lg mx-auto'>

        {/* Header */}
        <div className='mb-10'>
          <button
            onClick={() => path(-1)}
            className={` inline-flex items-center gap-1.5 text-xs font-medium mb-6 transition-colors  ${dark ? "text-neutral-500 " : "text-neutral-400"}`}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className={`text-2xl font-semobold tracking-tight mb-1 ${sub}`}>Upload a track</h1>
          <p className={`${sub}`}>Share your music with the world.</p>
        </div>

        <form onSubmit={handleSubmit}
          className='space-y-5'>

          {/* Audio Bar -  */}
          <div className={card}>
            <div className='px-5 pt-5 flex items-enter justify-between'>
              <p className={`text-indigo-500 ${eyebrow}`}><Music size={22} />Audio file</p>
              <span className={`text-sm ${sub}`}>MP3</span>
            </div>

            <div className='p-5'>

              {musicPreview ? (
                <div className={`rounded-xl border p-3 flex items-center gap-3 ${dark ? 'bg-neutral-800/60 border-neutral-800' : 'bg-white border-neutral-200'}`}>

                  {/* Hidden native element — does the actual playback,
                      but renders no visible UI of its own. */}
                  <audio
                    ref={audioRef}
                    src={musicPreview}
                    onEnded={() => setisPreviewPlaying(false)}
                    className='hidden' />

                  {/* our own play pause control */}

                  <button
                    type='button'
                    onClick={togglePriviewPlay}
                    className='shrink-0 w-9 h-9'>
                    {isPreviewPlaying ?
                      <Pause size={24} className="fill-current" />
                      : <Play size={24} className="fill-current ml-0.5" />}
                  </button>

                  {/* Filename  -takes up the midle space */}

                  <span className={` text-xs truncate flex-1 ${sub}`}>{audioFileName}</span>

                  <button type="button"
                    onClick={clearAudio}><X size={24} /></button>
                </div>

              ) : (
                <>
                  <input
                    type="file"
                    accept="audio/*"
                    id="file-upload"
                    onChange={handleAudioChange}
                    className='hidden'
                  />
                  <label htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed cursor-pointer transition-colors  ${dark
                      ? 'border-neutral-200 hover:border-indigo-500/50 hover:bg-indigo-500/5'
                      : 'border-neutral-500 hover:border-indigo-300 hover:bg-indigo-50/50'}`}
                  >

                    <Upload size={29} />
                    <span className='text-sm font-medium'>Click to upload audio</span>
                    <span className={`text-xs mt-1 ${sub}`}>MP3 · Max 5MB</span>
                  </label>
                </>
              )}
            </div>
          </div>

          {/* thumbnail cover art */}
          <div className={card}>
            <div className='px-5 pt-5 gap-4 flex items-center justify-between'>
              <p className={`${eyebrow} text-emerald-500`}><Image size={24} />cover art</p>
              <span className={`text-sm ${sub}`}>( Optional )</span>
            </div>

            <div className='p-5'>
              {imagePreview ? (
                <>

                  <div className={`relative rounded-xl overflow-hidden border ${dark ? "border-neutral-800" : "border-neutral-200"}`}>
                    <img src={imagePreview} alt="Cover" className='w-full h-44 object-cover' />
                    <button type='button' onClick={clearImage}
                      className='absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white'>
                      <X size={20} /></button>
                    <div className={`px-3 py-2 text-xs truncate ${dark ? 'bg-neutral-800/60 text-neutral-400' : 'bg-neutral-50 text-neutral-500'}`}>
                      {imageFileName}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label htmlFor="thumbnail-upload"
                    className={`flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed cursor-pointer transition-colors
                      ${dark
                        ? 'border-neutral-800 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                        : 'border-neutral-500 hover:border-emerald-300 hover:bg-emerald-50/50'}`}>
                    <Image size={29} className="mb-2 text-neutral-800" />
                    <span className="text-sm font-medium">Click to upload cover</span>
                    <span className={`text-xs mt-1 ${sub}`}>PNG · JPG · Max 1MB</span>
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Caption Title */}
          <div className={card}>
            <div className='px-5 pt-5'>
              <p className='text-amber-500'><FileText size={24} />Title</p>
            </div>

            <div className='px-4 py-1'>
              <textarea
                rows={1}
                value={caption}
                maxLength={maxlenth}
                placeholder='Trackk title or short description..'
                onChange={(e) => setCaption(e.target.value)}
                className={`w-full px-4 py-3 text-sm rounded border outline-none resize-none transition-colors
                  focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20
                  ${dark ? 'bg-neutral-800/60 border-neutral-800 text-neutral-100 placeholder-neutral-600' : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400'}`}
              />

              <div className='flex justify-end mt-1.5'>
                <span className={` text-sm tabular-nums ${caption.length > maxlenth * 0.9 ? 'text-red-500' : sub}`}>
                  {caption.length}/{maxlenth}
                </span>
              </div>
            </div>
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
              text-white font-semibold text-sm flex items-center justify-center gap-2
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Uploading…</>
              : <><Upload size={16} /> Publish track</>
            }
          </button>

        </form>
      </div>
    </main>
  )
}

export default CreateMusic

