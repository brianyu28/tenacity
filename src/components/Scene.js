import React, { useReducer } from 'react';
import { useSpring, animated as a } from 'react-spring';

import ControlPanel from './ControlPanel';
import GameIntro from './GameIntro';
import GameOver from './GameOver';
import Ground from './Ground';
import PlanetIntro from './PlanetIntro';
import ProgressIndicator from './ProgressIndicator';
import Level from './Level';
import MissionObjective from './MissionObjective';
import MissionBriefing from './MissionBriefing';

import { PLANETS } from '../game/missions';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../game/constants';
import { remaining_blocks } from '../game/blocks';

// Skip certain sequences
const DEV_MODE = false;
const START_PLANET = 0;
const START_MISSION = 0;

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

  // Changing missions
  NEXT_MISSION: 'NEXT_MISSION',
  REPEAT_MISSION: 'REPEAT_MISSION'
}

// Keeps track of current position in planet intro
const PLANET_INTRO_STATUS = {
  NOT_SHOWN: 0,
  ZOOMING: 1,
  COMPLETE: 2
};

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
  // TODO: add args
  [ACTION.ADD_TO_PROGRAM]: (state, {block, args}) => {
    return {...state, program: [...state.program, {block, args} ]}
  },
  [ACTION.RESET_PROGRAM]: state => {
    return {...state, program: []}
  },
  [ACTION.SUBMIT_PROGRAM]: (state, augmentedProgram) => {
    return {...state, program: augmentedProgram, programSubmitted: true}
  },

  // Changing missions
  [ACTION.NEXT_MISSION]: (state) => {
    const planet = PLANETS[state.planetIndex];

    // Next mission on this planet
    if (state.missionIndex + 1 < planet.missions.length) {
      return {
        ...state,
        missionIndex: state.missionIndex + 1,
        round: state.round + 1,
        program: [],
        programSubmitted: false,
      }

    // Next mission takes us to a new planet
    } else if (state.planetIndex + 1 < PLANETS.length) {
      return {
        ...state,
        planetIndex: state.planetIndex + 1,
        missionIndex: 0,
        round: state.round + 1,
        planetIntroStatus: PLANET_INTRO_STATUS.NOT_SHOWN,
        briefingShown: false,
        program: [],
        programSubmitted: false,
      }
    
    // No more levels
    } else {
      return {
        ...state,
        done: true
      }
    }
  },

  [ACTION.REPEAT_MISSION]: (state) => {
    return {
      ...state,
      round: state.round + 1,
      program: [],
      programSubmitted: false,
    }
  }
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
    planetIndex: START_PLANET || 0,
    missionIndex: START_MISSION || 0,
    done: false,
    round: 0,

    // Track current status of game
    introShown: development ? true : false,
    planetIntroStatus: development ? PLANET_INTRO_STATUS.COMPLETE: PLANET_INTRO_STATUS.NOT_SHOWN,
    briefingShown: development ? true : false,

    // Current sequence of blocks
    program: [],
    programSubmitted: false,

  }
}

const Scene = (props) => {

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
    round,
    done
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

  function addToProgram(block, args) {
    act(ACTION.ADD_TO_PROGRAM, {block, args});
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
      key={round}
      planetIndex={planetIndex}
      missionIndex={missionIndex}
      onFailure={() => act(ACTION.REPEAT_MISSION)}
      onSuccess={() => act(ACTION.NEXT_MISSION)}
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

  function showGround() {
    return <Ground
      planet={planet}
    />
  }

  const backgroundColorSpring = useSpring({
    to: {color: introShown ? (
      planetIntroStatus >= PLANET_INTRO_STATUS.ZOOMING ? planet.colors.sky : 'black'
      ) : 'rgba(0, 0, 0, 0)'},
    from: {color: 'rgba(0, 0, 0, 0)'},
    config: {duration: 1500}
  });

  const levelInProgress = planetIntroStatus === PLANET_INTRO_STATUS.COMPLETE;
  const showControlPanel = levelInProgress && briefingShown;

  // Game over screen
  if (done) {
    return <GameOver />;
  }

  return (
    <div style={{ maxWidth: CANVAS_WIDTH }}>
      <a.svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className='scene'
           style={{ backgroundColor: backgroundColorSpring.color }}
      >

        {/* Ground, appears when planet has been zoomed in  */}
        {planetIntroStatus >= PLANET_INTRO_STATUS.ZOOMING && showGround()}

        {levelInProgress && 
          <ProgressIndicator
            planet={planet}
            completedMissions={missionIndex}
          />
        }

        {!introShown ? showIntro() : !levelInProgress ? showPlanetIntro() : showLevel()}
      </a.svg>
      {levelInProgress &&
        (briefingShown ?
          <MissionObjective
            missionNumber={missionIndex + 1}
            objective={mission.objective}
            hint={mission.hint}
          />
        : showBriefing())
      }
      {showControlPanel &&
        <ControlPanel
          planetIndex={planetIndex}
          missionIndex={missionIndex}
          addToProgram={addToProgram}
          blocks={remaining_blocks(mission.blocks, program)}
          variables={mission.variables || []}
          onResetProgram={() => act(ACTION.RESET_PROGRAM)}
          onSubmitProgram={(augmentedProgram) => act(ACTION.SUBMIT_PROGRAM, augmentedProgram)}
          program={program}
          programSubmitted={programSubmitted}
        />
      }
    </div>
  );
};

export default Scene;