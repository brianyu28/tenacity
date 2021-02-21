import React, { useReducer } from 'react';
import { useSpring, animated as a } from 'react-spring';

import GameIntro from './GameIntro';
import PlanetIntro from './PlanetIntro';
import Level from './Level';

import { PLANETS } from '../game/missions';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

const ACTION = {
  COMPLETE_INTRO: 'COMPLETE_INTRO',
  COMPLETE_PLANET_INTRO: 'COMPLETE_PLANET_INTRO'
}

const HANDLER = {
  [ACTION.COMPLETE_INTRO]: state => {
    return {...state, introShown: true};
  },
  [ACTION.COMPLETE_PLANET_INTRO]: state => {
    return {...state, planetIntroShown: true}
  }
}

const reducer = (state, { type, payload }) => {
  const handler = HANDLER[type];
  if (!handler) return state;
  return handler(state, payload);
};

const getInitialState = () => {
  return {

    // Track current mission for user
    planetIndex: 0,
    missionIndex: 0,

    // Track current status of game
    introShown: false,
    planetIntroShown: false,

  }
}

export default (props) => {

  const { onStartPlaying } = props;

  const [state, dispatch] = useReducer(reducer, getInitialState());
  const act = (type, payload) => dispatch({ type, payload });

  const {
    planetIndex,
    missionIndex,
    introShown,
    planetIntroShown,
  } = state;

  // Handle entering and exiting introduction screens
  function handleCompleteIntro() {
    act(ACTION.COMPLETE_INTRO);
  }

  function handleCompletePlanetIntro() {
    act(ACTION.COMPLETE_PLANET_INTRO);
  }

  function showIntro() {
    return <GameIntro
      onStartPlaying={onStartPlaying}
      onCompleteIntro={handleCompleteIntro}
    />;
  }

  function showPlanetIntro() {
    return <PlanetIntro
      planetIndex={planetIndex}
      onCompleteIntro={handleCompletePlanetIntro}
    />
  }

  function showLevel() {
    return <Level
      planetIndex={planetIndex}
      missionIndex={missionIndex}
    />
  }

  const backgroundColorSpring = useSpring({
    to: {color: introShown ? (planetIntroShown ? PLANETS[planetIndex].colors.sky : 'black') : 'rgba(0, 0, 0, 0)'},
    from: {color: 'rgba(0, 0, 0, 0)'},
    config: {duration: 1500}
  });

  return (
    <div>
      <a.svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className='scene'
           style={{ backgroundColor: backgroundColorSpring.color }}
      >
          {!introShown ? showIntro() :
           !planetIntroShown ? showPlanetIntro() :
           showLevel()}
      </a.svg>
    </div>
  );
};