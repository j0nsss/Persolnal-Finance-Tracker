import { useEffect, useRef, useState } from "react";

function DinoSprite({ jumping }: { jumping: boolean }) {
  return (
    <svg
      width="40"
      height="44"
      viewBox="0 0 40 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`block ${jumping ? "" : "animate-[dinoLegs_0.2s_ease-in-out_infinite]"}`}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="10" y="8" width="20" height="16" rx="2" fill="#000" />
      <rect x="24" y="2" width="12" height="12" rx="2" fill="#000" />
      <rect x="30" y="5" width="3" height="3" fill="#fff" />
      <rect x="4" y="12" width="6" height="6" rx="1" fill="#000" />
      <rect x="14" y="24" width="3" height="6" rx="1" fill="#000" />
      <rect
        x="14"
        y="28"
        width="4"
        height="12"
        rx="1"
        fill="#000"
        className={jumping ? "" : "animate-[dinoLegLeft_0.2s_ease-in-out_infinite]"}
      />
      <rect
        x="20"
        y="28"
        width="4"
        height="12"
        rx="1"
        fill="#000"
        className={jumping ? "" : "animate-[dinoLegRight_0.2s_ease-in-out_infinite]"}
      />
      <rect x="34" y="8" width="3" height="2" fill="#fff" />
    </svg>
  );
}

function Cactus({ x }: { x: number }) {
  return (
    <div
      className="absolute bottom-2"
      style={{ left: `${x}%`, transform: "translateX(-50%)" }}
    >
      <svg width="14" height="28" viewBox="0 0 14 28" fill="#000" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="10" height="24" rx="3" fill="#000" />
        <rect x="8" y="0" width="6" height="12" rx="2" fill="#000" />
        <rect x="0" y="14" width="6" height="10" rx="2" fill="#000" />
      </svg>
    </div>
  );
}

export function DinoRun() {
  const [jumping, setJumping] = useState(false);
  const [obstacles, setObstacles] = useState<{ id: number; x: number }[]>([]);
  const [score, setScore] = useState(0);
  const idRef = useRef(0);
  const frameRef = useRef(0);
  const jumpingRef = useRef(false);
  const scoreRef = useRef(0);

  const autoJump = () => {
    if (jumpingRef.current) return false;
    jumpingRef.current = true;
    setJumping(true);
    setTimeout(() => {
      jumpingRef.current = false;
      setJumping(false);
    }, 450);
    return true;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      frameRef.current++;

      if (frameRef.current % 60 === 0) {
        const cactusX = 100 + Math.random() * 20;
        const id = ++idRef.current;
        setObstacles((prev) => [...prev, { id, x: cactusX }]);
      }

      if (frameRef.current % 5 === 0) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
      }

      setObstacles((prev) => {
        const moved = prev
          .map((o) => ({ ...o, x: o.x - 0.8 }))
          .filter((o) => o.x > -10);

        for (const o of moved) {
          if (o.x > 8 && o.x < 16 && !jumpingRef.current) {
            autoJump();
            break;
          }
        }

        return moved;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-16 overflow-hidden select-none border-t-3 border-base-ink/10 pt-3 mt-3">
      <div style={{ bottom: 0, left: 0, right: 0, height: 2, background: "#000", position: "absolute" }} />

      <div className="absolute bottom-1 left-0 right-0 flex gap-2 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 w-1 h-1 bg-base-ink/20 rounded-full"
            style={{
              animation: `groundScroll 0.8s linear infinite`,
              animationDelay: `${i * 0.04}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute top-1 right-2 font-mono tabular-nums text-xs font-bold text-base-ink/30">
        {String(score).padStart(5, "0")}
      </div>

      <div
        className="absolute bottom-2 left-4 z-10"
        style={{
          transform: jumping ? "translateY(-28px)" : "translateY(0)",
          transition: "transform 0.12s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <DinoSprite jumping={jumping} />
      </div>

      {obstacles.map((obs) => (
        <Cactus key={obs.id} x={obs.x} />
      ))}
    </div>
  );
}
