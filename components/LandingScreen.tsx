
import React from 'react';
import { PharaohKnowledgeLuckIcon } from './ImageAssets';

interface LandingScreenProps {
  onStart: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full max-w-md mx-auto border-2 border-[#D98B21] rounded-2xl p-8 flex flex-col items-center justify-center text-center animate-fade-in">
      <PharaohKnowledgeLuckIcon />
      <h1 className="text-5xl font-extrabold text-[#D98B21] mt-6 mb-4">
        Knowledge and luck
      </h1>
      <p className="text-white/80 mb-8 leading-relaxed">
        In the workshops of Ancient Egypt, creation was a dangerous gamble. Three rivals compete to craft wonders for the pharaoh pyramids, talismans, and sacred elixirs. When a craftsman dares to begin creation, the gods intervene. Will your fate be ruled by luck, or by knowledge?
      </p>
      <button
        onClick={onStart}
        className="bg-[#D98B21] text-white font-bold py-4 px-20 rounded-xl text-2xl hover:bg-amber-500 transition-all transform hover:scale-105"
      >
        Start
      </button>
    </div>
  );
};

export default LandingScreen;
