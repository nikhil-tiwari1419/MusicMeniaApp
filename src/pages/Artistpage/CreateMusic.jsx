import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useTheme } from '../../Context/Theme';
import { Upload, Music, Image, FileText, ArrowLeft, Loader2, X } from 'lucide-react';

function CreateMusic() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [musicPreview, setMusicPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioFileName, setAudioFileName] = useState('');
  const [imageFileName, setImageFileName] = useState('');

  const maxLength = 100;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10MB'); return; }
    setImageFileName(file.name);
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAudioFileName(file.name);
    setSelectedFile(file);
    setMusicPreview(URL.createObjectURL(file));
  };

  const clearAudio = () => { setMusicPreview(null); setAudioFileName(''); setSelectedFile(null); document.getElementById('file-upload').value = ''; };
  const clearImg = () => { setImagePreview(null); setImageFileName(''); setSelectedImage(null); };

  const resetForm = () => {
    setMusicPreview(null); setImagePreview(null); setAudioFileName(''); setImageFileName('');
    setSelectedFile(null); setSelectedImage(null); setCaption('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) { toast.error('Please select an audio file'); return; }
    if (!caption.trim()) { toast.error('Please add a title'); return; }

    setLoading(true);
    const formData = new FormData();
    formData.append('audio', selectedFile);
    formData.append('title', caption);
    if (selectedImage) formData.append('thumbnail', selectedImage);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/music/upload-music`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
      );
      if (response.data.success || response.status === 201) {
        toast.success('Music published successfully!');
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  const bg = dark ? 'bg-zinc-950' : 'bg-white';
  const card = `border-2 border-black shadow-[4px_4px_0_#000] ${dark ? 'bg-zinc-900' : 'bg-white'}`;
  const sub = dark ? 'text-zinc-400' : 'text-zinc-500';
  const sectionLabel = `text-xs font-black uppercase tracking-[0.15em] font-mono flex items-center gap-2 mb-3 ${dark ? 'text-white' : 'text-black'}`;
  const btn = `border-2 border-black shadow-[3px_3px_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-100`;

  return (
    <>
      
      <main className={`min-h-screen pt-20 pb-16 px-4 font-mono ${bg}`}>
        <div className="max-w-lg mx-auto">

          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-widest mb-5 ${btn} px-3 py-1.5
                ${dark ? 'bg-zinc-800 text-white border-black' : 'bg-white text-black border-black'}`}
            >
              <ArrowLeft size={13} /> Back
            </button>

            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-8 bg-yellow-400 border-2 border-black" />
              <h1 className={`text-xl font-black uppercase tracking-tight ${dark ? 'text-white' : 'text-black'}`}>
                Upload Track
              </h1>
            </div>
            <p className={`text-xs ml-5 uppercase tracking-wider ${sub}`}>Share your music</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Audio */}
            <div className={card}>
              <div className="px-5 py-3 border-b-2 border-black flex items-center justify-between">
                <p className={sectionLabel}><Music size={14} /> Audio File</p>
                <span className={`text-[10px] font-black uppercase tracking-wider ${sub}`}>MP3 · WAV · FLAC</span>
              </div>
              <div className="p-4">
                {musicPreview ? (
                  <div className={`border-2 border-black p-3 ${dark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                    <audio src={musicPreview} controls className="w-full h-9" />
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs truncate max-w-[80%] ${sub}`}>{audioFileName}</span>
                      <button type="button" onClick={clearAudio}
                        className={`p-1.5 border-2 border-black ${btn} ${dark ? 'bg-zinc-700 text-white' : 'bg-white text-black'}`}>
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <input type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload"
                      className={`flex flex-col items-center justify-center h-24 border-2 border-black border-dashed cursor-pointer transition-colors
                        ${dark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-50'}`}>
                      <Upload size={20} className={`mb-2 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                      <span className={`text-xs font-black uppercase tracking-wider ${dark ? 'text-zinc-300' : 'text-black'}`}>
                        Click to upload audio
                      </span>
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Cover Art */}
            <div className={card}>
              <div className="px-5 py-3 border-b-2 border-black flex items-center justify-between">
                <p className={sectionLabel}><Image size={14} /> Cover Art</p>
                <span className={`text-[10px] font-black uppercase tracking-wider ${dark ? 'text-yellow-400' : 'text-zinc-500'}`}>
                  Optional
                </span>
              </div>
              <div className="p-4">
                {imagePreview ? (
                  <div className="relative border-2 border-black">
                    <img src={imagePreview} alt="Cover" className="w-full h-44 object-cover" />
                    <button type="button" onClick={clearImg}
                      className={`absolute top-2 right-2 p-1.5 border-2 border-black bg-black text-white hover:bg-zinc-800 transition-colors`}>
                      <X size={12} />
                    </button>
                    <div className={`px-2 py-1 border-t-2 border-black text-xs truncate ${dark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500'}`}>
                      {imageFileName}
                    </div>
                  </div>
                ) : (
                  <>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="thumbnail-upload" />
                    <label htmlFor="thumbnail-upload"
                      className={`flex flex-col items-center justify-center h-36 border-2 border-black border-dashed cursor-pointer transition-colors
                        ${dark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-50'}`}>
                      <Image size={20} className={`mb-2 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                      <span className={`text-xs font-black uppercase tracking-wider ${dark ? 'text-zinc-300' : 'text-black'}`}>
                        Click to upload cover
                      </span>
                      <span className={`text-[10px] mt-1 uppercase tracking-wide ${sub}`}>PNG · JPG · Max 10MB</span>
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Title */}
            <div className={card}>
              <div className="px-5 py-3 border-b-2 border-black">
                <p className={sectionLabel}><FileText size={14} /> Title</p>
              </div>
              <div className="p-4">
                <textarea
                  rows={2}
                  maxLength={maxLength}
                  value={caption}
                  placeholder="TRACK TITLE OR DESCRIPTION..."
                  onChange={(e) => setCaption(e.target.value)}
                  className={`w-full px-3 py-2.5 text-sm border-2 border-black outline-none resize-none font-mono font-bold uppercase tracking-wide
                    placeholder:text-zinc-400 placeholder:font-normal placeholder:normal-case placeholder:tracking-normal
                    focus:shadow-[inset_2px_2px_0_#000] transition-all
                    ${dark ? 'bg-zinc-800 text-white' : 'bg-zinc-50 text-black'}`}
                />
                <div className="flex justify-end mt-1.5">
                  <span className={`text-[10px] font-black tabular-nums ${caption.length > maxLength * 0.9 ? 'text-red-500' : sub}`}>
                    {caption.length}/{maxLength}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 border-2 border-black bg-yellow-400 text-black font-black text-sm uppercase tracking-widest
                flex items-center justify-center gap-2
                shadow-[4px_4px_0_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]
                transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0_#000]
                disabled:hover:translate-x-0 disabled:hover:translate-y-0`}
            >
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Uploading...</>
                : <><Upload size={15} /> Publish Track</>
              }
            </button>

          </form>
        </div>
      </main>
    </>
  );
}

export default CreateMusic;