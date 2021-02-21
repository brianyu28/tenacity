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
  COMPLETE_PLANET_INTRO: 'COMPLETE_PLANET_INTRO',
  ZOOM_PLANET_INTRO: 'ZOOM_PLANET_INTRO'
}

const HANDLER = {
  [ACTION.COMPLETE_INTRO]: state => {
    return {...state, introShown: true};
  },
  [ACTION.ZOOM_PLANET_INTRO]: state => {
    if (state.planetIntroStatus === PLANET_INTRO_STATUS.NOT_SHOWN) {
      return {...state, planetIntroStatus: PLANET_INTRO_STATUS.ZOOMING}
    } else {
      return state;
    }
  },
  [ACTION.COMPLETE_PLANET_INTRO]: state => {
    return {...state, planetIntroStatus: PLANET_INTRO_STATUS.COMPLETE}
  }
};

// Keeps track of current position in planet intro
const PLANET_INTRO_STATUS = {
  NOT_SHOWN: 0,
  ZOOMING: 1,
  COMPLETE: 2
};

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
    planetIntroStatus: PLANET_INTRO_STATUS.NOT_SHOWN,

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
    planetIntroStatus,
  } = state;

  // Handle entering and exiting introduction screens
  function handleCompleteIntro() {
    act(ACTION.COMPLETE_INTRO);
  }

  function handleZoomPlanetIntro() {
    act(ACTION.ZOOM_PLANET_INTRO);
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
      onZoomIntro={handleZoomPlanetIntro}
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
    to: {color: introShown ? (
      planetIntroStatus >= PLANET_INTRO_STATUS.ZOOMING ? PLANETS[planetIndex].colors.sky : 'black'
      ) : 'rgba(0, 0, 0, 0)'},
    from: {color: 'rgba(0, 0, 0, 0)'},
    config: {duration: 1500}
  });

  return (
    <div>
      <a.svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className='scene'
           style={{ backgroundColor: backgroundColorSpring.color }}
      >
          {!introShown ? showIntro() :
           (planetIntroStatus != PLANET_INTRO_STATUS.COMPLETE) ? showPlanetIntro() :
           showLevel()}
      </a.svg>
    </div>
  );
};