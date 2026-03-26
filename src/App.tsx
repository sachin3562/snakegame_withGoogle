import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative font-vt selection:bg-[#ff00ff] selection:text-black uppercase">
      {/* Glitch/Static Overlays */}
      <div className="fixed inset-0 z-50 scanlines"></div>
      <div className="fixed inset-0 z-40 static-noise"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        <header className="mb-8 border-b-4 border-[#00ffff] pb-4">
          <h1 className="text-4xl md:text-6xl font-pixel text-[#00ffff] glitch-text" data-text="SYS.OP.SNAKE_PROTOCOL">
            SYS.OP.SNAKE_PROTOCOL
          </h1>
          <p className="text-[#ff00ff] text-2xl mt-4 tracking-widest">
            &gt; STATUS: ONLINE // AWAITING_INPUT
          </p>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-8">
          <div className="w-full max-w-2xl order-2 lg:order-1 flex-1 border-4 border-[#ff00ff] p-2 relative bg-black shadow-[8px_8px_0px_#00ffff]">
            <div className="absolute -top-4 left-4 bg-black text-[#ff00ff] px-2 font-pixel text-sm border-2 border-[#ff00ff]">
              DISPLAY_MATRIX
            </div>
            <div className="mt-4">
              <SnakeGame />
            </div>
          </div>
          
          <div className="w-full max-w-md order-1 lg:order-2 flex flex-col gap-8">
            <div className="border-4 border-[#00ffff] p-6 bg-black relative shadow-[8px_8px_0px_#ff00ff]">
              <div className="absolute -top-4 right-4 bg-black text-[#00ffff] px-2 font-pixel text-sm border-2 border-[#00ffff]">
                DIAGNOSTICS
              </div>
              <h2 className="text-3xl font-pixel text-[#ff00ff] mb-6 mt-2 glitch-text" data-text="SYS_CHK">
                SYS_CHK
              </h2>
              <ul className="space-y-4 text-2xl">
                <li className="flex justify-between border-b-2 border-[#00ffff]/30 pb-2">
                  <span>NET_LINK:</span>
                  <span className="text-[#00ffff] animate-pulse">ESTABLISHED</span>
                </li>
                <li className="flex justify-between border-b-2 border-[#00ffff]/30 pb-2">
                  <span>AUDIO_SYNC:</span>
                  <span className="text-[#ff00ff]">LOCKED</span>
                </li>
                <li className="flex justify-between border-b-2 border-[#00ffff]/30 pb-2">
                  <span>MEM_ALLOC:</span>
                  <span className="text-[#00ffff]">0x00F4C</span>
                </li>
              </ul>
            </div>
            
            <MusicPlayer />
          </div>
        </main>

        <footer className="mt-8 border-t-4 border-[#ff00ff] pt-4 text-[#00ffff] text-2xl flex justify-between">
          <span>&gt; INPUT_REQ: [W,A,S,D] OR [ARROWS]</span>
          <span className="animate-pulse">_</span>
        </footer>
      </div>
    </div>
  );
}
