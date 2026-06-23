/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";

interface HeartParticle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  rotation: number;
  vRotation: number;
}

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: HeartParticle[] = [];

    const colors = [
      "rgba(255, 117, 140, 0.8)", // Soft Rose Pink
      "rgba(226, 176, 255, 0.8)", // Lavender Glow
      "rgba(255, 210, 105, 0.8)", // Luxury Warm Gold
      "rgba(255, 154, 158, 0.8)", // Rose Gold
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const drawHeart = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number
    ) => {
      context.beginPath();
      context.moveTo(x, y + size / 4);
      context.quadraticCurveTo(x, y - size / 2, x + size / 2, y - size / 2);
      context.quadraticCurveTo(x + size, y - size / 2, x + size, y + size / 4);
      context.quadraticCurveTo(x + size, y + size * 0.7, x, y + size * 1.25);
      context.quadraticCurveTo(x - size, y + size * 0.7, x - size, y + size / 4);
      context.quadraticCurveTo(x - size, y - size / 2, x - size / 2, y - size / 2);
      context.quadraticCurveTo(x, y - size / 2, x, y + size / 4);
      context.closePath();
      context.fill();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;

      // Spawn particles on movement
      if (Math.random() < 0.3) {
        particles.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 6 + 4,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          vRotation: (Math.random() - 0.5) * 0.05,
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current.targetX = touch.clientX;
        mouseRef.current.targetY = touch.clientY;

        if (Math.random() < 0.4) {
          particles.push({
            x: touch.clientX,
            y: touch.clientY,
            size: Math.random() * 6 + 4,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5 - 0.5,
            alpha: 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2,
            vRotation: (Math.random() - 0.5) * 0.05,
          });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    const updateAndRender = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth cursor follow
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      // Render custom cursor dot
      if (mouse.x > 0 && mouse.y > 0) {
        // Outer glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(255, 117, 140, 0.6)";

        ctx.fillStyle = "rgba(255, 117, 140, 0.4)";
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0; // reset
      }

      // Render trailing particles
      particles = particles.filter((p) => p.alpha > 0.01);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRotation;
        p.alpha -= 0.012; // slow fade

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        
        // Add soft glow to particles
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;

        drawHeart(ctx, 0, 0, p.size);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(updateAndRender);
    };

    updateAndRender();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="custom-cursor-canvas"
      className="fixed inset-0 pointer-events-none z-50 mix-blend-screen"
    />
  );
}
