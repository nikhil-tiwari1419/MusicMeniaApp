import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../Components/Navbar';
import { useTheme } from '../../Context/Theme';
import { Upload, Music, Image, FileText, ArrowLeft, Loader2, X, CheckCircle2 } from 'lucide-react';

function CreateMusic() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [musicPreview, setMusicPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [captionLength, setCaptionLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [audioFileName, setAudioFileName] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [caption, setCaption] = useState('');

  const maxLength = 100;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10MB'); e.target.value = ''; return; }
    setImageFileName(file.name);
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Audio must be under 5MB'); e.target.value = ''; return; }
    setAudioFileName(file.name);
    setSelectedFile(file);
    setMusicPreview(URL.createObjectURL(file));
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
    setCaptionLength(e.target.value.length);
  };

  const clearAudio = () => { setMusicPreview(null); setAudioFileName(''); setSelectedFile(null); document.getElementById('file-upload').value = ''; };
  const clearImg = () => { setImagePreview(null); setImageFileName(''); setSelectedImage(null); };

  const resetForm = () => {
    setMusicPreview(null); setImagePreview(null); setAudioFileName(''); setImageFileName('');
    setSelectedFile(null); setSelectedImage(null); setCaptionLength(0); setCaption('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!selectedFile) { toast.error('Please select an audio file!'); setLoading(false); return; }
    if (!selectedImage) { toast.error('Please select a thumbnail!'); setLoading(true); return; }
    if (!caption.trim()) { toast.error('Please add a description!'); setLoading(false); return; }

    const formData = new FormData();
    formData.append('audio', selectedFile);
    formData.append('title', caption);
    formData.append('thumbnail', selectedImage);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/music/upload-music`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
      );
      if (response.data.success || response.status === 201) {
        toast.success('Music published successfully 🎉');
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Audio', done: !!selectedFile },
    { label: 'Cover', done: !!selectedImage },
    { label: 'Details', done: !!caption.trim() },
  ];

  return (
    <>
      <Navbar />
      <main className={`min-h-screen pt-20 pb-12 px-4 transition-colors ${dark ? 'bg-gray-950' : 'bg-gray-50'}`}>

        {/* bg glow */}
        <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none
          ${dark ? 'bg-emerald-500/5' : 'bg-emerald-400/8'}`} />

        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-2 text-sm mb-6 transition-colors
                ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}
            >
              <ArrowLeft size={16} /> Back to Home
            </button>

            <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
              Upload Music
            </h1>
            <p className={`text-sm mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Share your sound with the world
            </p>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((step, i) => (
              <React.Fragment key={step.label}>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
                    ${step.done
                      ? 'bg-emerald-500 text-white'
                      : dark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                    }`}>
                    {step.done ? <CheckCircle2 size={14} /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${step.done
                    ? 'text-emerald-500'
                    : dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px ${step.done
                    ? 'bg-emerald-500/50'
                    : dark ? 'bg-gray-800' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Audio Upload */}
            <div className={`rounded-2xl border p-5 transition-all
              ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>

              <div className="flex items-center gap-2 mb-4">
                <div className={`p-1.5 rounded-lg ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <Music size={15} className={dark ? 'text-emerald-400' : 'text-emerald-600'} />
                </div>
                <span className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                  Audio File
                </span>
                <span className="text-xs text-gray-400 ml-auto">MP3 · Max 5MB</span>
              </div>

              {musicPreview ? (
                <div className={`rounded-xl p-3 border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <audio src={musicPreview} controls className="w-full h-10" />
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs truncate max-w-[80%] ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {audioFileName}
                    </p>
                    <button type="button" onClick={clearAudio}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <input type="file" name="file" accept="audio/*" onChange={handleAudioChange}
                    className="hidden" id="file-upload" />
                  <label htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed cursor-pointer transition-all
                      ${dark
                        ? 'border-gray-700 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                        : 'border-gray-200 hover:border-emerald-400 hover:bg-emerald-50'
                      }`}>
                    <Upload size={22} className={`mb-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Click to upload audio
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">or drag and drop</p>
                  </label>
                </>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div className={`rounded-2xl border p-5 transition-all
              ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>

              <div className="flex items-center gap-2 mb-4">
                <div className={`p-1.5 rounded-lg ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <Image size={15} className={dark ? 'text-emerald-400' : 'text-emerald-600'} />
                </div>
                <span className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                  Cover Art
                </span>
                <span className="text-xs text-gray-400 ml-auto">PNG, JPG · Max 10MB</span>
              </div>

              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Cover preview"
                    className="w-full h-52 object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-black/20 rounded-xl" />
                  <button type="button" onClick={clearImg}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors">
                    <X size={14} />
                  </button>
                  <p className={`mt-2 text-xs truncate ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {imageFileName}
                  </p>
                </div>
              ) : (
                <>
                  <input type="file" name="thumbnail" accept="image/*" onChange={handleImageChange}
                    className="hidden" id="thumbnail-upload" />
                  <label htmlFor="thumbnail-upload"
                    className={`flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all
                      ${dark
                        ? 'border-gray-700 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                        : 'border-gray-200 hover:border-emerald-400 hover:bg-emerald-50'
                      }`}>
                    <Image size={22} className={`mb-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Click to upload cover
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">or drag and drop</p>
                  </label>
                </>
              )}
            </div>

            {/* Caption */}
            <div className={`rounded-2xl border p-5
              ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>

              <div className="flex items-center gap-2 mb-4">
                <div className={`p-1.5 rounded-lg ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <FileText size={15} className={dark ? 'text-emerald-400' : 'text-emerald-600'} />
                </div>
                <span className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                  Title / Description
                </span>
              </div>

              <textarea
                id="caption"
                rows={3}
                maxLength={maxLength}
                value={caption}
                placeholder="Give your track a title or short description..."
                onChange={handleCaptionChange}
                className={`w-full px-4 py-3 rounded-xl text-sm border outline-none resize-none transition-all placeholder-gray-400
                  focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50
                  ${dark
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
              />
              <div className="flex justify-end mt-1.5">
                <span className={`text-xs tabular-nums ${captionLength > maxLength * 0.9 ? 'text-red-400' : 'text-gray-400'}`}>
                  {captionLength}/{maxLength}
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm
                transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Uploading...</>
              ) : (
                <><Upload size={16} /> Publish Track</>
              )}
            </button>

          </form>
        </div>
      </main>
    </>
  );
}

export default CreateMusic;