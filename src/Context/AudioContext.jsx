import { createContext, useContext, useRef, useState, useEffect, useCallback } from "react";

const AudioCtx = createContext(null);

export function AudioProvider({ children }) {
    const audioRef = useRef(new Audio()); //lives forever , never unmounts

    const [playingTrack, setplayingTrack] = useState(null);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
        const saved = JSON.parse(localStorage.getItem("recentlyPlayed"));

        if (!saved) return [];

        const twoDays = 24 * 60 * 60 * 1000;

        if (Date.now() - saved.timestamp > twoDays) {
            localStorage.removeItem("recentlyPlayed");
            return [];
        }

        return saved.data || [];
    });

    // is playing is delivered - true only when audio is excately running
    const [isPlaying, setIsPlaying] = useState(false);

    // ── Queue & Repeat state ──
    const [queue, setQueue] = useState([]);       // ordered list of tracks for sequential playback
    const [repeat, setRepeat] = useState(false);  // "Play Again" — loop current track

    // Refs so event-listeners always see fresh values (avoids stale closures)
    const queueRef = useRef(queue);
    const repeatRef = useRef(repeat);
    const playingTrackRef = useRef(playingTrack);

    useEffect(() => { queueRef.current = queue; }, [queue]);
    useEffect(() => { repeatRef.current = repeat; }, [repeat]);
    useEffect(() => { playingTrackRef.current = playingTrack; }, [playingTrack]);

    // ── Internal helper: play a specific track object (no toggle logic) ──
    const playTrackInternal = useCallback((track) => {
        const audio = audioRef.current;
        audio.src = track.url;
        audio.load();
        setplayingTrack(track);
        addToRecentlyPlayed(track);
        setProgress(0);
        setCurrentTime(0);
        setDuration(0);
    }, []);

    useEffect(() => {
        const audio = audioRef.current;

        function onTimeUpdate() {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100 || 0);
        }

        function onLoadeMetadata() { setDuration(audio.duration || 0); }
        function onCanPlay() {
            setDuration(audio.duration || 0);
            audio.play().catch(() => { });
        }

        function onEnded() {
            // ── Repeat ("Play Again") ──
            if (repeatRef.current) {
                audio.currentTime = 0;
                audio.play().catch(() => { });
                return;
            }

            // ── Sequential queue playback ──
            const currentQueue = queueRef.current;
            const currentTrack = playingTrackRef.current;

            if (currentQueue.length > 0 && currentTrack) {
                const currentIndex = currentQueue.findIndex(
                    (t) => t._id === currentTrack._id
                );

                if (currentIndex !== -1 && currentIndex < currentQueue.length - 1) {
                    // Play next track in queue
                    const nextTrack = currentQueue[currentIndex + 1];
                    // Use direct manipulation to avoid stale closure issues
                    audio.src = nextTrack.url;
                    audio.load();
                    setplayingTrack(nextTrack);
                    // Add next track to recently played
                    setRecentlyPlayed((prev) => {
                        const filtered = prev.filter((item) => item._id !== nextTrack._id);
                        const updated = [nextTrack, ...filtered].slice(0, 5);
                        localStorage.setItem(
                            "recentlyPlayed",
                            JSON.stringify({ data: updated, timestamp: Date.now() })
                        );
                        return updated;
                    });
                    setProgress(0);
                    setCurrentTime(0);
                    setDuration(0);
                    return;
                }
            }

            // No next track — stop playback
            setplayingTrack(null);
            setProgress(0);
            setCurrentTime(0);
        }

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadeMetadata);
        audio.addEventListener('canplay', onCanPlay);
        audio.addEventListener('ended', onEnded);

        // clean up only when entire app unmount

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadeMetadata);
            audio.removeEventListener('canplay', onCanPlay);
            audio.removeEventListener('ended', onEnded);
        };

    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);


        return () => {
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);

        }
    }, []);

    function addToRecentlyPlayed(track) {
        setRecentlyPlayed((prev) => {

            // remove duplicates
            const filtered = prev.filter(
                (item) => item._id !== track._id
            );

            // add newest track at beginning
            const updated = [track, ...filtered].slice(0, 5);

            // save to localStorage
            localStorage.setItem(
                "recentlyPlayed",
                JSON.stringify({
                    data: updated,
                    timestamp: Date.now()
                })
            );

            return updated;
        });
    }

    /**
     * togglePlay(track, newQueue?)
     * - If same track: toggle pause/play
     * - If different track: switch to it
     * - If newQueue is provided: update the active queue (playlist context)
     */
    function togglePlay(track, newQueue) {
        const audio = audioRef.current;
        if (!audio) return;

        // Update queue if a new list context is provided
        if (newQueue && Array.isArray(newQueue) && newQueue.length > 0) {
            setQueue(newQueue);
        }

        if (playingTrack?._id === track._id) {
            if (audio.paused) {
                audio.play().catch(() => { });
            } else {
                audio.pause();
            }
        } else {
            // Different track → switch
            audio.src = track.url;
            audio.load();
            // audio.play().catch(() => {});

            setplayingTrack(track);
            addToRecentlyPlayed(track);
            setProgress(0);
            setCurrentTime(0);
            setDuration(0);
        }
    }

    // ── Play Next track in queue ──
    function playNext() {
        if (queue.length === 0 || !playingTrack) return;
        const currentIndex = queue.findIndex((t) => t._id === playingTrack._id);
        if (currentIndex !== -1 && currentIndex < queue.length - 1) {
            playTrackInternal(queue[currentIndex + 1]);
        }
    }

    // ── Play Previous track in queue ──
    function playPrevious() {
        if (queue.length === 0 || !playingTrack) return;
        const currentIndex = queue.findIndex((t) => t._id === playingTrack._id);
        if (currentIndex > 0) {
            playTrackInternal(queue[currentIndex - 1]);
        }
    }

    // ── Toggle Repeat ("Play Again") ──
    function toggleRepeat() {
        setRepeat((prev) => !prev);
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
        setplayingTrack(null);
        setProgress(0);
        setCurrentTime(0);
    }

    return (
        <AudioCtx.Provider value={{
            playingTrack,
            currentSong: playingTrack,
            isPlaying,
            progress,
            currentTime,
            duration,
            recentlyPlayed,
            volume,
            queue,
            repeat,
            togglePlay,
            playNext,
            playPrevious,
            toggleRepeat,
            handleSeek,
            handleVolume,
            stopMusic,
        }}>
            {children}
        </AudioCtx.Provider>
    );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useAudio = () => useContext(AudioCtx)

