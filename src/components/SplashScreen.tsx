import { motion } from 'motion/react';
import { useEffect } from 'react';
import adventLogo from 'figma:asset/be0ccaab92bd3f8a21797fb9fde7da0653f5979e.png';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-[#1B1B1B] flex items-center justify-center overflow-hidden">
      <div className="relative flex flex-col items-center">
        {/* Animated rings */}
        <motion.div
          className="absolute w-64 h-64 rounded-full border-2 border-[#C1121F]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.2, 1],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        />

        <motion.div
          className="absolute w-64 h-64 rounded-full border-2 border-[#C1121F]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.2, 1],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 0.5,
            delay: 0.4,
          }}
        />

        {/* Logo container with fade in and scale */}
        <motion.div
          className="relative z-10"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <img src={adventLogo} alt="Advent Engineers" className="h-24 w-auto" />
        </motion.div>

        {/* Company name with slide up animation */}
        <motion.div
          className="mt-6 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h1 className="text-white text-[28px] tracking-wide">Advent Engineers</h1>
          <motion.div
            className="h-1 bg-[#C1121F] mt-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />
        </motion.div>

        {/* Subtitle with fade in */}
        <motion.p
          className="mt-6 text-gray-400 text-sm tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          Industrial Oven Monitoring System
        </motion.p>

        {/* Loading dots */}
        <motion.div
          className="flex gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.4 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-[#C1121F] rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="mt-8 w-64 h-1 bg-gray-800 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.4 }}
        >
          <motion.div
            className="h-full bg-[#C1121F]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ delay: 2, duration: 1.2, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </div>
  );
}
