import { createContext, useContext, useRef, useState, useEffect } from "react";

const AudioCtx = createContext(null);

export function AudioProvider({ children }) {
    const audioRef = useRef(new Audio()); //lives forever , never unmounts

    const [playingTrack, setPlayingTrack] = useState(null);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    // is playing is delivered - true only when audio is excately running
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;

        function onTimeUpdate() {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100 || 0);
        }

        function onLoadeMetadata() { setDuration(audio.duration || 0); }
        function onEnded() {
            setPlayingTrack(null);
            setProgress(0);
            setCurrentTime(0);
        }

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadeta', onLoadeMetadata);
        audio.addEventListener('ended', onEnded);

        // clean up only when entire app unmount

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadeMetadata);
            audio.removeEventListener('ended', onEnded);
        };

    }, []);

    useEffect(()=>{
        const audio = audioRef.current;
        const onPlay  = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        audio.addEventListener('play',onPlay);
        audio.addEventListener('pause',onPause);


        return ()=>{
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause',onPause);      
        
        }
    },[]);


    function togglePlay(track) {
        const audio = audioRef.current;
        if (playingTrack?._id === track._id) {
            if (audio.paused) {
                audio.play().catch(() => {});
            } else {
                audio.pause();
            }
        } else {
            // Different track → switch
            audio.src = track.url;
            audio.load();
            audio.play().catch(() => {});
            setPlayingTrack(track);
            setProgress(0);
            setCurrentTime(0);
        }
    }

    function handleSeek(val) {
        const audio = audioRef.current;
        if (!audio.duration) return;
        audio.currentTime = (val / 100) * audio.duration;
        setProgress(val)
    }

    function handleVolume(val) {
        setVolume(val);
        audioRef.current.volume = val;
    }

    function stopMusic() {
        audioRef.current.pause();
        setPlayingTrack(null);
        setProgress(0);
        setCurrentTime(0);
    }

    return (
        <AudioCtx.Provider value={{
            playingTrack,
            isPlaying,
            progress,
            currentTime,
            duration,
            volume,
            togglePlay,
            handleSeek,
            handleVolume,
            stopMusic,
        }}>
            {children}
        </AudioCtx.Provider>
    );
}
export const useAudio = () => useContext(AudioCtx)