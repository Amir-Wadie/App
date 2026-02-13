
import React, { useState, useEffect } from 'react';
import { GlowingDieIcon, GlowingBookIcon } from './ImageAssets';

interface FateRollProps {
  seed: number;
  onFateRevealed: (roll: number) => void;
}

const FateRoll: React.FC<FateRollProps> = ({ seed, onFateRevealed }) => {
  const [isDecided, setIsDecided] = useState(false);
  const [isOdd, setIsOdd] = useState(false);

  useEffect(() => {
    // Deterministically decide fate based on seed
    const seededRandom = (s: number) => {
      const a = 1664525, c = 1013904223, m = 2**32;
      s = (a * s + c) % m;
      return s / m;
    };
    const random = seededRandom(seed);
    const result = Math.floor(random * 6) + 1;
    setIsOdd(result % 2 !== 0);
    
    // Show the result after a brief delay
    const timer = setTimeout(() => setIsDecided(true), 500);
    return () => clearTimeout(timer);
  }, [seed]);

  const handleProceed = () => {
    onFateRevealed(isOdd ? 1 : 2); // Pass odd/even result
  };

  if (!isDecided) {
    return (
      <div className="text-2xl font-bold text-amber-400 animate-pulse">
        Deciding your fate...
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto border-2 border-[#D98B21] rounded-2xl p-8 flex flex-col items-center justify-center text-center animate-fade-in">
      {isOdd ? (
        <>
          <GlowingBookIcon />
          <h1 className="text-5xl font-extrabold text-[#D98B21] mt-6 mb-4">Knowledge</h1>
          <p className="text-white/80 mb-8 leading-relaxed">
            The pharaoh has decided. This time, fate will not be left to chance. The gods demand wisdom, not luck, and only those who understand the secrets of the ancients may proceed.
          </p>
        </>
      ) : (
        <>
          <GlowingDieIcon />
          <h1 className="text-5xl font-extrabold text-[#D98B21] mt-6 mb-4">Luck</h1>
          <p className="text-white/80 mb-8 leading-relaxed">
            The pharaoh has spoken. When craft and ambition collide, knowledge alone is no longer enough. The gods will not be questioned, and wisdom will not be tested this time. Fate will be decided by luck.
          </p>
        </>
      )}
      <button
        onClick={handleProceed}
        className="bg-[#D98B21] text-white font-bold py-4 px-20 rounded-xl text-2xl hover:bg-amber-500 transition-all transform hover:scale-105"
      >
        lets go
      </button>
    </div>
  );
};

export default FateRoll;
