import React from 'react';
import luisImage from '../images/luis.png';
import braillindaImage from '../images/braillinda.png';

interface AvatarsProps {
  author: string;
}

const Avatars: React.FC<AvatarsProps> = ({ author }) => {
  const activeStyles = 'opacity-100 scale-100 transition-transform duration-300';
  const narratorHidenStyles = author.toLowerCase() === 'narrador' ? 'opacity-0' : '';
  return (
    <div className={`flex justify-between mb-2 ${narratorHidenStyles}`}>
      <img
        className={`w-1/2 max-w-40 opacity-70 scale-75 ${author.toLowerCase() === 'luis' ? activeStyles : 'opacity-70'}`}
        src={luisImage}
        alt="Maestro luis"
      />
      <img
        className={`w-1/2 max-w-40 opacity-70 scale-75 ${author.toLowerCase() === 'braillinda' ? activeStyles : 'opacity-70'}`}
        src={braillindaImage}
        alt="Hada braillinda"
      />
    </div>
  );
};

export default Avatars;