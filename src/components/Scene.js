import React, { useReducer } from 'react';
import { useSpring, animated as a } from 'react-spring';

import ControlPanel from './ControlPanel';
import GameIntro from './GameIntro';
import PlanetIntro from './PlanetIntro';
import ProgressIndicator from './ProgressIndicator';
import Level from './Level';
import MissionObjective from './MissionObjective';
import MissionBriefing from './MissionBriefing';

import { PLANETS } from '../game/missions';
import { CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_HEIGHT } from '../game/constants';
import { remaining_blocks } from '../game/blocks';

// Skip certain sequences
const DEV_MODE = true;

const ACTION = {

  // Intro screens
  COMPLETE_INTRO: 'COMPLETE_INTRO',
  COMPLETE_PLANET_INTRO: 'COMPLETE_PLANET_INTRO',
  ZOOM_PLANET_INTRO: 'ZOOM_PLANET_INTRO',
  COMPLETE_BRIEFING: 'COMPLETE_BRIEFING',

  // Program actions
  ADD_TO_PROGRAM: 'ADD_TO_PROGRAM',
  RESET_PROGRAM: 'RESET_PROGRAM',
  SUBMIT_PROGRAM: 'SUBMIT_PROGRAM',
  SET_INST_PTR: 'SET_INST_PTR',
}

const HANDLER = {

  // Intro screens
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
  },
  [ACTION.COMPLETE_BRIEFING]: state => {
    return {...state, briefingShown: true}
  },

  // Program actions
  [ACTION.ADD_TO_PROGRAM]: (state, block) => {
    return {...state, program: [...state.program, block]}
  },
  [ACTION.RESET_PROGRAM]: state => {
    return {...state, program: []}
  },
  [ACTION.SUBMIT_PROGRAM]: state => {
    return {...state, programSubmitted: true}
  },
  [ACTION.SET_INST_PTR]: (state, instruction) => {
    return {...state, currentInstruction: instruction}
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

// Returns initial state. Includes devellopment flag for skipping parts.
const getInitialState = (development) => {

  return {

    // Track current mission for user
    planetIndex: 0,
    missionIndex: 0,

    // Track current status of game
    introShown: development ? true : false,
    planetIntroStatus: development ? PLANET_INTRO_STATUS.COMPLETE: PLANET_INTRO_STATUS.NOT_SHOWN,
    briefingShown: development ? true : false,

    // Current sequence of blocks
    program: [],
    programSubmitted: false,
    currentInstruction: 0

  }
}

export default (props) => {

  const { onStartPlaying } = props;

  const [state, dispatch] = useReducer(reducer, getInitialState(DEV_MODE));
  const act = (type, payload) => dispatch({ type, payload });

  const {
    planetIndex,
    missionIndex,
    introShown,
    planetIntroStatus,
    briefingShown,
    program,
    programSubmitted,
    currentInstruction
  } = state;

  const planet = PLANETS[planetIndex];
  const mission = planet.missions[missionIndex];

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

  function handleCompleteBriefing() {
    act(ACTION.COMPLETE_BRIEFING);
  }

  function addToProgram(block) {
    act(ACTION.ADD_TO_PROGRAM, block);
  }

  function setCurrentInstruction(i) {
    act(ACTION.SET_INST_PTR, i);
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
      currentInstruction={currentInstruction}
      planetIndex={planetIndex}
      missionIndex={missionIndex}
      setCurrentInstruction={setCurrentInstruction}
      program={program}
      programSubmitted={programSubmitted}
    />
  }

  function showBriefing() {
    return <MissionBriefing
      briefing={planet.briefing}
      onCompleteBriefing={handleCompleteBriefing}
    />
  }

  const backgroundColorSpring = useSpring({
    to: {color: introShown ? (
      planetIntroStatus >= PLANET_INTRO_STATUS.ZOOMING ? planet.colors.sky : 'black'
      ) : 'rgba(0, 0, 0, 0)'},
    from: {color: 'rgba(0, 0, 0, 0)'},
    config: {duration: 1500}
  });

  const levelInProgress = planetIntroStatus == PLANET_INTRO_STATUS.COMPLETE;
  const showControlPanel = levelInProgress && briefingShown;

  return (
    <div style={{ maxWidth: CANVAS_WIDTH }}>
      <a.svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className='scene'
           style={{ backgroundColor: backgroundColorSpring.color }}
      >

        {/* Ground, appears when planet has been zoomed in  */}
        {planetIntroStatus >= PLANET_INTRO_STATUS.ZOOMING &&
          <rect
            x={0} y={CANVAS_HEIGHT - GROUND_HEIGHT} width={CANVAS_WIDTH} height={GROUND_HEIGHT}
            fill={planet.colors.main}
          />
        }

        {levelInProgress && 
          <ProgressIndicator
            planet={planet}
            completedMissions={missionIndex}
          />
        }

        {!introShown ? showIntro() : !levelInProgress ? showPlanetIntro() : showLevel()}
      </a.svg>
      {levelInProgress &&
        (briefingShown ? <MissionObjective missionNumber={missionIndex + 1} objective={mission.objective} />
        : showBriefing())
      }
      {showControlPanel &&
        <ControlPanel
          addToProgram={addToProgram}
          blocks={remaining_blocks(mission.blocks, program)}
          onResetProgram={() => act(ACTION.RESET_PROGRAM)}
          onSubmitProgram={() => act(ACTION.SUBMIT_PROGRAM)}
          program={program}
          programSubmitted={programSubmitted}
        />
      }
    </div>
  );
};