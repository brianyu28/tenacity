import React, { useState } from 'react';
import { useSpring, animated as a } from 'react-spring';
import Sound from 'react-sound';

import Scene from './Scene';

import backgroundMusic from '../assets/amerika.mp3';

const ASound = a(Sound);

const Page = () => {

  const [playing, setPlaying] = useState(false);
  const handleStartPlaying = () => setPlaying(true);

  // Fade in audio
  const audioSpring = useSpring({
    to: {volume: playing ? 100 : 0},
    from: {volume: 0},
    config: {duration: 8000}
  });

  return (
    <div className='page'>
      <div className='scene-container'>
        <Scene
          onStartPlaying={handleStartPlaying}
        />
      </div>
      <ASound
        url={backgroundMusic}
        playStatus={playing ? Sound.status.PLAYING : Sound.status.STOPPED}
        autoLoad={true}
        loop={true}
        volume={audioSpring.volume}
      />
    </div>
  );
}

export default Page;