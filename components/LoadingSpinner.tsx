
import React, { useState, useEffect } from 'react';
import { LoaderRingImage } from './assets';

const LoadingSpinner: React.FC = () => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage(prev => {
        if (prev >= 99) {
          clearInterval(interval);
          return 99;
        }
        return prev + 1;
      });
    }, 150); // Fake progress for visual effect

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 w-full">
      <div className="relative w-72 h-72 md:w-96 md:h-96">
        <img 
          src={LoaderRingImage} 
          alt="Generating progress" 
          className="w-full h-full animate-spin-slow"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-white text-3xl font-bold tracking-widest">GENERATING</p>
            <p className="text-amber-400 text-2xl font-bold mt-2">{percentage}%</p>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
