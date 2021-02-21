import React, { useReducer } from 'react';

import GameIntro from './GameIntro';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const ACTION = {
  COMPLETE_INTRO: 'COMPLETE_INTRO'
}

const HANDLER = {
  [ACTION.COMPLETE_INTRO]: state => {
    return {...state, introShown: true};
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
    planet: 0,
    mission: 0,

    // Track current status of game
    introShown: false,

  }
}

export default () => {

  const [state, dispatch] = useReducer(reducer, getInitialState());
  const act = (type, payload) => dispatch({ type, payload });

  const {
    planet,
    mission,
    introShown
  } = state;

  function handleCompleteIntro() {
    act(ACTION.COMPLETE_INTRO);
  }

  function showIntro() {
    return <GameIntro
      onCompleteIntro={handleCompleteIntro}
    />;
  }

  function showLevel() {
    return <text x='50%' y='50%' fill='white'>level</text>
  }

  return (
    <svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className='scene'>
        {!introShown ? showIntro() : showLevel()}
    </svg>
  );
};