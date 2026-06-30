// pages/_app.js
import { useAudio } from '../hooks/useAudio';

export default function MyApp({ Component, pageProps }) {
  // Pass the path to your default starting track
  const audioContext = useAudio('/audio/Akon - Lonely.mp3');

  return (
    <>
      {/* This element stays in the DOM forever */}
      <audio ref={audioContext.audioRef} loop src={audioContext.src} />
      
      {/* Pass controls to your pages as a prop */}
      <Component {...pageProps} audioContext={audioContext} />
    </>
  );
}