import { useEffect, useRef } from 'react';

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  opacity: number;
  size: number;
}

export function RainAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const rainDrops = useRef<RainDrop[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize rain drops
    const initRainDrops = () => {
      rainDrops.current = [];
      const numDrops = Math.floor((canvas.width * canvas.height) / 15000);
      
      for (let i = 0; i < numDrops; i++) {
        rainDrops.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: Math.random() * 3 + 2,
          opacity: Math.random() * 0.6 + 0.1,
          size: Math.random() * 2 + 1
        });
      }
    };

    initRainDrops();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient for rain drops
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(173, 216, 230, 0.8)'); // Light blue
      gradient.addColorStop(1, 'rgba(135, 206, 235, 0.3)'); // Sky blue

      rainDrops.current.forEach((drop) => {
        // Update position
        drop.y += drop.speed;
        drop.x += Math.sin(drop.y * 0.01) * 0.5; // Add slight horizontal movement

        // Reset drop when it goes off screen
        if (drop.y > canvas.height + 10) {
          drop.y = -10;
          drop.x = Math.random() * canvas.width;
        }

        // Draw rain drop
        ctx.save();
        ctx.globalAlpha = drop.opacity;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(drop.x, drop.y, drop.size * 0.5, drop.size * 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}