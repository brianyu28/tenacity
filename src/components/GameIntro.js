import { useRef } from 'react';
import { useChain, useSpring, animated } from 'react-spring';

import '../css/GameIntro.css';

export default ({ onCompleteIntro }) => {

  const titleSpring = useSpring({
    to: [
      {config: {duration: 500}},
      {config: {duration: 2000}, to: {opacity: 1}},
      {config: {duration: 4000}},
      {config: {duration: 2000}, to: {opacity: 0}}
    ],
    from: {opacity: 0},
    onRest: () => {
      console.log('rest');
      onCompleteIntro();
    }
  });

  const subheadSpring = useSpring({
    to: [
      {config: {duration: 2500}},
      {config: {duration: 2000}, to: {opacity: 1}},
      {config: {duration: 2350}},
      {config: {duration: 2000}, to: {opacity: 0}}
    ],
    from: {opacity: 0}
  });

  return (
    <g>
      <animated.text
        x='50%'
        y='50%'
        dominantBaseline='middle'
        textAnchor='middle'
        className='titleText'
        opacity={titleSpring.opacity}
      >
        Tenacity
      </animated.text>

      <animated.text
        x='50%'
        y='70%'
        dominantBaseline='middle'
        textAnchor='middle'
        className='subheadText'
        opacity={subheadSpring.opacity}
      >
        A computer science experience by Brian Yu
      </animated.text>

    </g>
  );
}