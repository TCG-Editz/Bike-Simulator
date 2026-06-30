import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudio(initialPath) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // 1. Add state for the track source
  const [src, setSrc] = useState(initialPath);

  // 2. Add function to update the source
  const changeTrack = useCallback((newPath) => {
    setSrc(newPath);
    setIsPlaying(true); // Auto-play when switching
  }, []);

  // 3. Effect to play when src changes
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(console.error);
    }
  }, [src, isPlaying]);

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key.toLowerCase() === 'm') toggleMusic();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMusic]);

  // 4. Return the new values
  return { audioRef, isPlaying, toggleMusic, changeTrack, src };
}