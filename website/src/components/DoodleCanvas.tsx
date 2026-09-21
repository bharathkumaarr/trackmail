"use client";

import { useEffect, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
  age: number;
  color: string;
  size: number;
}

export function DoodleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const isDrawingRef = useRef(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const colors = ["#4f46e5", "#6366f1", "#f43f5e", "#f59e0b", "#10b981"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Animation loop: render points with fading alpha
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const points = pointsRef.current;

      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        pt.age += 0.02;

        if (pt.age >= 1) {
          points.splice(i, 1);
          i--;
          continue;
        }

        const alpha = Math.max(0, 1 - pt.age) * 0.55;

        // Draw smooth organic circle / stroke
        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * (1 - pt.age * 0.3), 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.restore();

        // Connect adjacent points with sketch lines
        if (i > 0 && points[i - 1]) {
          const prev = points[i - 1];
          const dist = Math.hypot(pt.x - prev.x, pt.y - prev.y);
          if (dist < 40) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(pt.x, pt.y);
            ctx.strokeStyle = pt.color;
            ctx.lineWidth = Math.max(1, pt.size * (1 - pt.age * 0.5));
            ctx.globalAlpha = alpha * 0.8;
            ctx.lineCap = "round";
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const addPoint = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (!hasInteracted) setHasInteracted(true);

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    pointsRef.current.push({
      x,
      y,
      age: 0,
      color: randomColor,
      size: Math.random() * 3 + 3,
    });
  };

  return (
    <div className="pointer-events-auto absolute inset-0 z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-crosshair opacity-80"
        onMouseDown={(e) => {
          isDrawingRef.current = true;
          addPoint(e.clientX, e.clientY);
        }}
        onMouseUp={() => {
          isDrawingRef.current = false;
        }}
        onMouseMove={(e) => {
          if (isDrawingRef.current || Math.random() > 0.6) {
            addPoint(e.clientX, e.clientY);
          }
        }}
        onTouchMove={(e) => {
          if (e.touches[0]) {
            addPoint(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
      />
      {!hasInteracted && (
        <div className="pointer-events-none absolute right-8 top-12 hidden select-none items-center gap-2 rounded-full border border-dashed border-ink/20 bg-surface/80 px-3 py-1 text-xs font-medium text-ink-muted backdrop-blur-xs md:flex">
          <span className="font-doodle text-sm font-bold text-brand">✍ doodle on the page!</span>
        </div>
      )}
    </div>
  );
}
