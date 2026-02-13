
import React, { useState } from 'react';
import { GlowingDieIcon } from './ImageAssets';

const DiceFlow: React.FC = () => {
  const [isRolling, setIsRolling] = useState(false);
  const [rollResult, setRollResult] = useState<number | null>(null);

  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    setRollResult(null);

    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      setRollResult(result);
      setIsRolling(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-md mx-auto border-2 border-[#D98B21] rounded-2xl p-8 flex flex-col items-center justify-center text-center animate-fade-in">
      <div className={`transition-all duration-500 ${isRolling ? 'scale-110 -rotate-12' : ''}`}>
        <GlowingDieIcon />
      </div>

      <h2 className="text-4xl font-semibold text-[#65A30D] my-6">
        Check your luck
      </h2>

      {rollResult !== null && !isRolling && (
        <p className="text-2xl font-bold text-white mb-6 animate-fade-in">You rolled a {rollResult}!</p>
      )}

      <button
        onClick={handleRoll}
        disabled={isRolling}
        className="bg-[#D98B21] text-white font-bold py-4 px-16 rounded-xl text-2xl hover:bg-amber-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isRolling ? 'Rolling...' : 'Roll DICE'}
      </button>
    </div>
  );
};

export default DiceFlow;
