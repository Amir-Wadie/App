import React from 'react';
import { PharaohEmblemImage, GlowingDieImage, GlowingBookImage } from './assets';

export const PharaohKnowledgeLuckIcon: React.FC = () => (
    <img src={PharaohEmblemImage} alt="Pharaoh emblem for knowledge and luck" className="w-48 h-48 md:w-56 md:h-56 object-contain" />
);

export const GlowingDieIcon: React.FC = () => (
    <img src={GlowingDieImage} alt="Glowing pharaonic die" className="w-48 h-48 md:w-56 md:h-56 object-contain" />
);

export const GlowingBookIcon: React.FC = () => (
    <img src={GlowingBookImage} alt="Glowing pharaonic book of knowledge" className="w-48 h-48 md:w-56 md:h-56 object-contain" />
);
