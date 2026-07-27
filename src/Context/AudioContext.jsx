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

    const [isPlaying, setIsPlaying] = useState(false);

    const [queue, setQueue] = useState([]);
    const [repeat, setRepeat] = useState(false);

    const queueRef = useRef(queue);
    const repeatRef = useRef(repeat);
    const playingTrackRef = useRef(playingTrack);

    // ── NEW: holds a consumer-registered "queue ended, need more" callback.
    // A ref (not state) because it's called from inside an audio event
    // listener where we need the LATEST function, not a stale one.
    const onQueueEndRef = useRef(null);

    useEffect(() => { queueRef.current = queue; }, [queue]);
    useEffect(() => { repeatRef.current = repeat; }, [repeat]);
    useEffect(() => { playingTrackRef.current = playingTrack; }, [playingTrack]);

    const playTrackInternal = useCallback((track) => {
        const audio = audioRef.current;
        audio.src = track.url;
        audio.load();
        setplayingTrack(track);
        addToRecentlyPlayed(track);
        setProgress(0);
        setCurrentTime(0);
        setDuration(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    audio.src = nextTrack.url;
                    audio.load();
                    setplayingTrack(nextTrack);
                    setRecentlyPlayed((prev) => {
                        const filtered = prev.filter((item) => item._id !== nextTrack._id);
                        const updated = [nextTrack, ...filtered].slice(0, 10);
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

            // ── Current queue exhausted ──
            // Give the registered consumer (e.g. LocalFeed) a chance to load
            // more tracks (next pagination page) and continue playback.
            // We do NOT reset playingTrack/progress here — the consumer's
            // callback is responsible for either continuing playback or,
            // if there's truly nothing left, calling stopMusic() itself.
            if (onQueueEndRef.current) {
                onQueueEndRef.current();
                return;
            }

            // No handler registered — fall back to the old behaviour: stop.
            setplayingTrack(null);
            setProgress(0);
            setCurrentTime(0);
        }

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadeMetadata);
        audio.addEventListener('canplay', onCanPlay);
        audio.addEventListener('ended', onEnded);

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

    useEffect(() => {
        return () => {
            const audio = audioRef.current;
            if (audio) {
                audio.pause();
                audio.src = '';
                audio.load();
            }
        };
    }, []);

    function addToRecentlyPlayed(track) {
        setRecentlyPlayed((prev) => {
            const filtered = prev.filter(
                (item) => item._id !== track._id
            );
            const updated = [track, ...filtered].slice(0, 10);
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

    function togglePlay(track, newQueue) {
        const audio = audioRef.current;
        if (!audio) return;

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
            audio.src = track.url;
            audio.load();
            audio.play().catch((error) => {
                console.log("Play error:", error)
            });
            setplayingTrack(track);
            addToRecentlyPlayed(track);
            setProgress(0);
            setCurrentTime(0);
            setDuration(0);
        }
    }

    function playNext() {
        if (queue.length === 0 || !playingTrack) return;
        const currentIndex = queue.findIndex((t) => t._id === playingTrack._id);
        if (currentIndex !== -1 && currentIndex < queue.length - 1) {
            playTrackInternal(queue[currentIndex + 1]);
        }
    }

    function playPrevious() {
        if (queue.length === 0 || !playingTrack) return;
        const currentIndex = queue.findIndex((t) => t._id === playingTrack._id);
        if (currentIndex > 0) {
            playTrackInternal(queue[currentIndex - 1]);
        }
    }

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

    // ── NEW: lets a consumer (e.g. LocalFeed) register/replace the
    // "what to do when the queue runs out" handler. Call with `null`
    // to unregister (e.g. on unmount) so a stale page's handler never fires.
    function registerQueueEndHandler(fn) {
        onQueueEndRef.current = fn;
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
            setQueue,
            togglePlay,
            playNext,
            playPrevious,
            toggleRepeat,
            handleSeek,
            handleVolume,
            stopMusic,
            registerQueueEndHandler,
        }}>
            {children}
        </AudioCtx.Provider>
    );
}
export const useAudio = () => useContext(AudioCtx)