import { useEffect, useState } from "react";
import { animate } from "framer-motion";

export function useCountUp(target: number, duration = 1.2) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [target, duration]);

  return value;
}
