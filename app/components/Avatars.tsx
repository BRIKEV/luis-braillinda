import React from 'react';
import luisImage from '../images/luis.png';
import braillindaImage from '../images/braillinda.png';

interface AvatarsProps {
  author: string;
}

const Avatars: React.FC<AvatarsProps> = ({ author }) => {
  return (
    <div className="flex md:w-72 m-auto">
      <img className={`w-1/2 ${author.toLowerCase() === 'luis' ? 'opacity-100': 'opacity-70'}`} src={luisImage} alt="Maestro luis" />
      <img className={`w-1/2 ${author.toLowerCase() === 'braillinda' ? 'opacity-100' : 'opacity-70'}`} src={braillindaImage} alt="Hada braillinda" />
    </div>
  );
};

export default Avatars;