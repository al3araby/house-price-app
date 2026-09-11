"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function Preloader() {
  const [done, setDone] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Total timeline (~1.6s) then a fast fade out. Safety timeout prevents the
    // preloader from ever blocking the app if an animation is interrupted.
    const finish = setTimeout(() => setDone(true), 1600);
    const safety = setTimeout(() => setDone(true), 4000);
    return () => {
      clearTimeout(finish);
      clearTimeout(safety);
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#050505]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reducedMotion ? { duration: 0.15 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex w-full max-w-[500px] flex-col items-center px-8">
            {/* Logo */}
            <motion.div
              className="flex flex-col items-center"
              initial={reducedMotion ? false : { opacity: 0, y: 30, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={reducedMotion ? { duration: 0.01 } : { duration: 0.7, ease: "easeOut" }}
            >
              <img
                src="/logo.png"
                alt="El3raby"
                width={320}
                height={320}
                className="h-auto w-[220px] object-contain"
              />

              <div className="mt-[-15px] text-center">
                <h1 className="font-serif text-[38px] tracking-[0.35em] text-[#c9a45c]">
                  EL3RABY
                </h1>

                <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-[#c9a45c] to-transparent" />

                <p className="mt-3 text-[9px] tracking-[0.35em] text-[#a88a4a]">
                  AI ENGINEER & CYBERSECURITY ENGINEER
                </p>
              </div>
            </motion.div>

            {/* Loading */}
            <motion.div
              className="mt-14 w-full"
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reducedMotion ? { duration: 0.01 } : { duration: 0.4, ease: "easeOut", delay: 0.4 }}
            >
              <div className="relative h-[2px] w-full overflow-hidden bg-[#292317]">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#7c5b24] via-[#f1cf78] to-[#8c672b]"
                  initial={reducedMotion ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={reducedMotion ? { duration: 0.01 } : { duration: 0.9, ease: "easeInOut" }}
                  style={{ transformOrigin: "left center" }}
                />

                {/* Glow */}
                <div className="absolute right-0 top-1/2 h-5 w-20 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#e7bd5b] opacity-40 blur-xl" />
              </div>

              <p className="mt-4 text-center text-[9px] tracking-[0.5em] text-[#8f763f]">
                ... LOADING ...
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
