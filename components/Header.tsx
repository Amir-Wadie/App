
import React from 'react';
import { CraftLogoImage, GlowingDieImage } from './assets';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 flex justify-between items-center">
      <img src={CraftLogoImage} alt="Craft Logo" className="h-10" />
      <img src={GlowingDieImage} alt="Dice Icon" className="h-12" />
    </header>
  );
};

export default Header;
