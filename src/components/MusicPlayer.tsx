import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: "DATA_STREAM_01.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "CORRUPT_SECTOR.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "VOID_RESONANCE.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("ERR_AUDIO:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const skipForward = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const skipBack = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };

  return (
    <div className="border-4 border-[#ff00ff] p-6 bg-black relative uppercase font-vt shadow-[8px_8px_0px_#00ffff]">
      <div className="absolute -top-4 left-4 bg-black text-[#ff00ff] px-2 font-pixel text-sm border-2 border-[#ff00ff]">
        AUDIO_CTRL
      </div>
      
      <div className="mt-4 mb-6 border-2 border-[#00ffff] p-4 bg-[#00ffff]/10 relative overflow-hidden">
        <div className="text-[#00ffff] text-xl mb-2">CURRENT_FILE:</div>
        <div className="text-[#ff00ff] text-3xl truncate glitch-text font-pixel" data-text={currentTrack.title}>
          {currentTrack.title}
        </div>
        {isPlaying && (
          <div className="absolute bottom-0 left-0 h-1 bg-[#ff00ff] animate-[pulse_1s_infinite] w-full"></div>
        )}
      </div>

      <div className="flex gap-4">
        <button onClick={skipBack} className="flex-1 border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black py-3 text-2xl transition-none active:translate-y-1 active:translate-x-1">
          &lt;&lt; PRV
        </button>
        <button onClick={togglePlay} className="flex-[2] border-2 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black py-3 text-2xl transition-none font-bold active:translate-y-1 active:translate-x-1">
          {isPlaying ? '|| HALT' : '> EXEC'}
        </button>
        <button onClick={skipForward} className="flex-1 border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black py-3 text-2xl transition-none active:translate-y-1 active:translate-x-1">
          NXT &gt;&gt;
        </button>
      </div>

      <audio ref={audioRef} src={currentTrack.url} onEnded={skipForward} preload="auto" />
    </div>
  );
}
