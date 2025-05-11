import React from 'react';
import luisImage from '../images/luis.png';
import braillindaImage from '../images/braillinda.png';

interface AvatarsProps {
  author: string;
}

const hiddenAvatars = ['narrador', 'tu turno'];
const isHidden = (author: string) => hiddenAvatars.includes(author.toLowerCase());

const Avatars: React.FC<AvatarsProps> = ({ author }) => {
  const activeStyles = 'opacity-100 scale-100 transition-transform duration-300';
  const hiddenStyles = isHidden(author) ? 'opacity-0' : '';
  return (
    <div className={`flex items-center justify-between mb-2 bg-[url('/app/images/background.png')] bg-cover bg-no-repeat bg-center h-96 w-full rounded-lg md:justify-evenly`}>
      <img
        className={`max-w-50 w-50 scale-75  ${hiddenStyles} ${author.toLowerCase() === 'luis' ? activeStyles : ''}`}
        src={luisImage}
        alt="Maestro luis"
      />
      <img
        className={`w-1/2 max-w-40 flip-image scale-75 ${hiddenStyles} ${author.toLowerCase() === 'braillinda' ? activeStyles : ''}`}
        src={braillindaImage}
        alt="Hada braillinda"
      />
    </div>
  );
};

export default Avatars;