import { useEffect, useRef, useState, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const INITIAL_SPEED = 120; // ms per frame
const SPEED_INCREMENT = 2;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Game state refs
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const directionRef = useRef<Point>({ x: 0, y: 0 });
  const nextDirectionRef = useRef<Point>({ x: 0, y: 0 });
  const foodRef = useRef<Point>({ x: 15, y: 10 });
  const lastUpdateRef = useRef<number>(0);
  const speedRef = useRef<number>(INITIAL_SPEED);
  const particlesRef = useRef<{x: number, y: number, vx: number, vy: number, life: number, color: string}[]>([]);
  const shakeRef = useRef<number>(0);

  const spawnFood = useCallback(() => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = snakeRef.current.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
    }
    foodRef.current = newFood!;
  }, []);

  const resetGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    speedRef.current = INITIAL_SPEED;
    particlesRef.current = [];
    shakeRef.current = 0;
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    spawnFood();
  }, [spawnFood]);

  const handleGameOver = useCallback(() => {
    setGameOver(true);
    for (let i = 0; i < 40; i++) {
      particlesRef.current.push({
        x: snakeRef.current[0].x * CELL_SIZE + CELL_SIZE / 2,
        y: snakeRef.current[0].y * CELL_SIZE + CELL_SIZE / 2,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        life: 1.0,
        color: '#ff00ff'
      });
    }
    shakeRef.current = 20;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (!gameStarted && e.key === ' ') {
        resetGame();
        return;
      }

      if (gameOver && e.key === ' ') {
        resetGame();
        return;
      }

      const dir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (dir.y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
          if (dir.y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          if (dir.x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          if (dir.x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, gameStarted, resetGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const gameLoop = (timestamp: number) => {
      if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
      const deltaTime = timestamp - lastUpdateRef.current;

      if (gameStarted && !gameOver && deltaTime >= speedRef.current) {
        directionRef.current = nextDirectionRef.current;
        const head = snakeRef.current[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
        } 
        else if (snakeRef.current.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver();
        } else {
          snakeRef.current.unshift(newHead);

          if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
            setScore((s) => {
              const newScore = s + 1;
              if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('snakeHighScore', newScore.toString());
              }
              return newScore;
            });
            speedRef.current = Math.max(40, speedRef.current - SPEED_INCREMENT);
            
            // Food eaten particles
            for (let i = 0; i < 15; i++) {
              particlesRef.current.push({
                x: foodRef.current.x * CELL_SIZE + CELL_SIZE / 2,
                y: foodRef.current.y * CELL_SIZE + CELL_SIZE / 2,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                color: '#00ffff'
              });
            }
            shakeRef.current = 8; 
            spawnFood();
          } else {
            snakeRef.current.pop();
          }
        }
        lastUpdateRef.current = timestamp;
      }

      // Render Background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      if (shakeRef.current > 0) {
        const dx = (Math.random() - 0.5) * shakeRef.current;
        const dy = (Math.random() - 0.5) * shakeRef.current;
        ctx.save();
        ctx.translate(dx, dy);
        shakeRef.current *= 0.9;
        if (shakeRef.current < 0.5) shakeRef.current = 0;
      } else {
        ctx.save();
      }

      // Draw Grid (Harsh lines)
      ctx.strokeStyle = '#00ffff';
      ctx.globalAlpha = 0.1;
      ctx.lineWidth = 1;
      for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_SIZE, i);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // Draw Food (Blocky)
      const food = foodRef.current;
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(
        food.x * CELL_SIZE + 2,
        food.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4
      );

      // Draw Snake (Blocky, alternating colors or solid magenta)
      snakeRef.current.forEach((segment, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? '#ffffff' : '#ff00ff';
        
        ctx.fillRect(
          segment.x * CELL_SIZE + 1,
          segment.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        );
      });

      // Draw Particles (Square)
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        
        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
        } else {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
          ctx.globalAlpha = 1.0;
        }
      }

      ctx.restore();

      // Glitch Overlay on Game Over / Start
      if (!gameStarted || gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        ctx.font = '24px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (!gameStarted) {
          ctx.fillStyle = '#00ffff';
          ctx.fillText('INIT_SEQ', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 30);
          ctx.font = '12px "Press Start 2P", monospace';
          ctx.fillStyle = '#ff00ff';
          ctx.fillText('> PRESS SPACE <', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 20);
        } else if (gameOver) {
          // Draw multiple offset texts for glitch effect
          ctx.fillStyle = '#00ffff';
          ctx.fillText('SYS.HALT', CANVAS_SIZE / 2 - 2, CANVAS_SIZE / 2 - 30);
          ctx.fillStyle = '#ff00ff';
          ctx.fillText('SYS.HALT', CANVAS_SIZE / 2 + 2, CANVAS_SIZE / 2 - 30);
          ctx.fillStyle = '#ffffff';
          ctx.fillText('SYS.HALT', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 30);

          ctx.font = '12px "Press Start 2P", monospace';
          ctx.fillStyle = '#00ffff';
          ctx.fillText('> REBOOT (SPACE) <', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 30);
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, gameOver, highScore, spawnFood, handleGameOver]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto font-vt">
      <div className="flex justify-between w-full px-4 py-2 bg-black border-2 border-[#00ffff]">
        <div className="flex flex-col">
          <span className="text-[#00ffff] text-lg uppercase tracking-widest">CYCLES</span>
          <span className="text-white font-pixel text-xl">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#ff00ff] text-lg uppercase tracking-widest">MAX_CYCLES</span>
          <span className="text-white font-pixel text-xl">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>
      
      <div className="relative p-1 bg-black border-4 border-[#ff00ff] shadow-[0_0_15px_#ff00ff]">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-black block"
          style={{ width: '100%', maxWidth: '400px', height: 'auto', aspectRatio: '1/1', imageRendering: 'pixelated' }}
        />
      </div>
    </div>
  );
}
