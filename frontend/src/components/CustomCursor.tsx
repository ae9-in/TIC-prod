import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface TrailParticle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  createdAt: number;
}

export const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasPointer, setHasPointer] = useState(false);
  const [particles, setParticles] = useState<TrailParticle[]>([]);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const lastPos = useRef({ x: -100, y: -100 });

  // Spring configurations for smooth trailing lag
  const springConfig = { damping: 30, stiffness: 280, mass: 0.6 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only target devices with standard pointer / cursor capability
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setHasPointer(mediaQuery.matches);

    const mediaListener = (e: MediaQueryListEvent) => setHasPointer(e.matches);
    mediaQuery.addEventListener("change", mediaListener);

    if (!mediaQuery.matches) return;

    // Inject class to hide browser default cursor
    document.documentElement.classList.add("custom-cursor-active");

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Throttled particle trail generation
      const distance = Math.hypot(e.clientX - lastPos.current.x, e.clientY - lastPos.current.y);
      if (distance > 15) {
        const id = `${Date.now()}-${Math.random()}`;
        const newParticle: TrailParticle = {
          id,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 4 + 8, // Font size for + particle
          color: Math.random() > 0.5
            ? "from-primary to-primary/40 shadow-primary/30"
            : "from-accent to-accent/40 shadow-accent/30",
          createdAt: Date.now(),
        };

        setParticles((prev) => [...prev.slice(-25), newParticle]);
        lastPos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Dynamic hover listeners for interactive elements
    const addHoverListeners = () => {
      const clickables = document.querySelectorAll(
        'a, button, [role="button"], input, select, textarea, .cursor-pointer'
      );
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovered(true));
        el.addEventListener("mouseleave", () => setIsHovered(false));
      });
    };

    addHoverListeners();

    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      mediaQuery.removeEventListener("change", mediaListener);
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      observer.disconnect();
    };
  }, [cursorX, cursorY, isVisible]);

  // Handle particle trail lifespan cleanup
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setParticles((prev) => prev.filter((p) => now - p.createdAt < 600));
    }, 100);
    return () => clearInterval(interval);
  }, [particles]);

  if (!hasPointer || !isVisible) return null;

  return (
    <>
      {/* HUD Particle Trail (Floating "+" tech particles) */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: p.y, scale: 0.5, opacity: 0.8 }}
          animate={{
            y: p.y + (Math.random() * 40 - 20), // Drift vertically
            x: p.x + (Math.random() * 40 - 20), // Drift horizontally
            scale: 0,
            opacity: 0,
            rotate: Math.random() * 180 - 90, // Spin rotation
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 font-display font-black bg-gradient-to-br ${p.color} bg-clip-text text-transparent`}
          style={{ fontSize: p.size }}
        >
          +
        </motion.div>
      ))}

      {/* Outer HUD Ring 1 (Dashed Clockwise - Spring lag) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-screen flex items-center justify-center"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          width: isHovered ? 40 : 28,
          height: isHovered ? 40 : 28,
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
      >
        <motion.div
          className="w-full h-full rounded-full border border-dashed"
          style={{ borderColor: isHovered ? "rgba(14, 165, 233, 0.7)" : "rgba(45, 212, 191, 0.6)" }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: isHovered ? 2.5 : 5, ease: "linear" }}
        />
      </motion.div>

      {/* Outer HUD Ring 2 (Brackets Counter-Clockwise - Spring lag) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-screen flex items-center justify-center"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          width: isHovered ? 52 : 38,
          height: isHovered ? 52 : 38,
          scale: isClicking ? 0.75 : 1,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
      >
        <motion.div
          className="w-full h-full rounded-full border-l-2 border-r-2 border-t-transparent border-b-transparent"
          style={{ borderColor: isHovered ? "rgba(45, 212, 191, 0.8)" : "rgba(14, 165, 233, 0.5)" }}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: isHovered ? 3 : 6, ease: "linear" }}
        />
      </motion.div>

      {/* Center solid focal dot (Tracks mouse instantly) */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-primary pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(45,212,191,0.6)]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isHovered ? 0.5 : 1,
          backgroundColor: isHovered ? "rgba(14, 165, 233, 1)" : "rgba(45, 212, 191, 1)",
        }}
      />
    </>
  );
};

export default CustomCursor;
