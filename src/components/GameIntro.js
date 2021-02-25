import { useState } from 'react';
import { useSpring, animated as a } from 'react-spring';

import { logEvent } from '../analytics';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../game/constants';
import '../css/GameIntro.css';

const BUTTON_WIDTH = 200;
const BUTTON_HEIGHT = 80;

export default ({ onCompleteIntro, onStartPlaying }) => {

  // State to keep track of whether play button has been clicked
  const [start, setStart] = useState(false);

  // Fade in and fade out for titles
  const titleSpring = useSpring({
    to: {opacity: start ? 0 : 1},
    from: {opacity: 0},
    config: {duration: 1500},
    onRest: () => {
      if (start)
        onCompleteIntro();
    }
  });

  // Start playing music and begin game
  const completeIntro = () => {
    logEvent({
      'category': 'Game',
      'action': 'Play Game'
    });
    onStartPlaying();
    setStart(true);
  };

  return (
    <a.g opacity={titleSpring.opacity}>

      {/* Main title */}
      <text
        x='50%'
        y='30%'
        dominantBaseline='middle'
        textAnchor='middle'
        className='titleText'
        opacity={titleSpring.opacity}
      >
        Tenacity
      </text>

      {/* Subtitle */}
      <text
        x='50%'
        y='45%'
        dominantBaseline='middle'
        textAnchor='middle'
        className='subheadText'
        opacity={titleSpring.opacity}
      >
        A game by Brian Yu
      </text>

      {/* Play button */}
      <rect
        x={(CANVAS_WIDTH - BUTTON_WIDTH) / 2}
        y='360'
        height={BUTTON_HEIGHT}
        width={BUTTON_WIDTH}
        rx={20}
        fill='white'
        className='hoverable'
        onClick={completeIntro}
      />
      <text
        x={CANVAS_WIDTH / 2}
        y='400'
        dominantBaseline='middle'
        textAnchor='middle'
        style={{ fontSize: '48px', fill: 'black' }}
        className='hoverable'
        onClick={completeIntro}
      >
        Play
      </text>

    </a.g>
  );
}