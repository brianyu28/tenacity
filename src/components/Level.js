import { useState, useEffect } from 'react';
import { useSpring, useSprings, animated as a } from 'react-spring';

import { Item } from './Item';

import { getMissionLabel, logEvent } from '../analytics';
import { BLOCK_NAMES } from '../game/blocks';
import { PLANETS } from '../game/missions';
import { obj_y } from '../game/objects';

const AItem = a(Item);

export default ({ currentInstruction, planetIndex, missionIndex,
                  onSuccess, onFailure,
                  setCurrentInstruction, program, programSubmitted }) => {

  const planet = PLANETS[planetIndex];
  const mission = planet.missions[missionIndex];

  useEffect(() => {
    logEvent({
      category: 'Level',
      action: 'Start Level',
      label: getMissionLabel(planetIndex, missionIndex)
    });
  }, []);

  const [state, setState] = useState({
    startTime: new Date(),
    instructionsCompleted: 0,
    items: mission.items,
    winMessage: false,
    loseMessage: false
  });

  const { startTime, instructionsCompleted, items, winMessage, loseMessage } = state;
  
  // Determine index of rover
  const roverIndex = items.findIndex(item => item.id === 'rover');
  const rover = items[roverIndex];

  // Check if level is won
  function checkWin() {
    for (let i = 0; i < mission.criteria.length; i++) {
      if (!checkCriteria(mission.criteria[i])) {
        return false;
      }
    }
    return true;
  }

  // Check if particular criteria is true
  function checkCriteria(criterion) {
    switch (criterion.category) {
      
      // Confirm x location of rover
      case 'rover_x':
        if (criterion.value === rover.x) {
          return true;
        }
        return false;

      case 'rover_carry':
        for (const item of items) {
          if (item.id === criterion.value && item.carried === true) {
            return true;
          }
        }
        return false;

      default:
        console.log('Error: Unknown criterion.');
        return false;
    }

  }

  // Check to see if item will fall into something that allows falling
  function checkFall(target) {
    for (const item of items) {
      if (item.allowFall && item.x == target.x && target.elevation === 0) {
        return true;
      }
    }
    return false;
  }

  // Get object to pick up; closest object to rover, null if none
  function getPickupObject() {
    let obj = null; 
    for (const item of items) {
      if (item !== rover && item.x === rover.x && (obj === null || item.elevation > obj.elevation)) {
        obj = item;
      }
    }
    return obj;
  }

  // Run an instruction
  if (programSubmitted && currentInstruction < program.length &&
      instructionsCompleted == currentInstruction && !winMessage && !loseMessage) {
    const instruction = program[currentInstruction];

    // Decide which instruction to use
    switch (instruction) {

      // Move the rover forward
      case BLOCK_NAMES.FORWARD:
        setState(state => ({
          ...state,
          instructionsCompleted: state.instructionsCompleted + 1,
          items: state.items.map((item, i) => i === roverIndex || item.carried === true ? {
              ...item,
              x: rover.costumeNumber === 0 ? item.x + 100 : item.x - 100
            } : item),
        }));
        break;

      case BLOCK_NAMES.TURN:
        setState(state => ({
          ...state,
          instructionsCompleted: state.instructionsCompleted + 1,
          items: state.items.map((item, i) => i === roverIndex ? {
              ...rover,
              costumeNumber: rover.costumeNumber === 0 ? 1 : 0
            } : item),
        }));
        break;

      case BLOCK_NAMES.PICK_UP:
        const obj = getPickupObject();
        if (obj != null) {
          setState(state => ({
            ...state,
            instructionsCompleted: state.instructionsCompleted + 1,
            items: state.items.map((item, i) => item === obj ? {
              ...obj,
              elevation: 30,
              carried: true
            } : i === roverIndex ? {
              ...rover,
              util: (rover.util || 0) + 1
            } : item),
          }))
        }
        break;

      default:
        console.log('ERROR: Unknown block.');
    }
}

const winSpring = useSpring({
  to: {opacity: winMessage ? 1 : 0},
  from: {opacity: 0},
  config: {duration: 1000},
  delay: 500,
  onRest: () => {
    if (winMessage) {
      logEvent({
        category: 'Level',
        action: 'Win Level',
        label: getMissionLabel(planetIndex, missionIndex),
        value: Math.round((new Date() - startTime) / 1000)
      });
      setTimeout(() => {
        onSuccess();
      }, 2500);
    }
  }
});

const loseSpring = useSpring({
  to: {opacity: loseMessage ? 1 : 0},
  from: {opacity: 0},
  config: {duration: 1000},
  delay: 500,
  onRest: () => {
    if (loseMessage) {
      logEvent({
        category: 'Level',
        action: 'Lose Level',
        label: getMissionLabel(planetIndex, missionIndex),
        value: Math.round((new Date() - startTime) / 1000)
      });
      setTimeout(() => {
        onFailure();
      }, 2500);
    }
  }
});

const itemSprings = useSprings(items.length, items.map((item, i) => ({
  to: {
    x: item.x,
    elevation: item.elevation,
    opacity: item.opacity,
    util: item.util || 0 // utility variable to force transitions
  },
  config: {duration: 1000},
  onRest: () => {

    if (winMessage || loseMessage) {
      return;
    }

    // Check for collisions
    if (i === roverIndex && programSubmitted) {
      if (checkFall(item)) {
        setState(state => ({
          ...state,
          items: state.items.map((item, i) => i === roverIndex || item.carried === true ? {
            ...item,
            elevation: item.elevation - 20
          } : item),
          loseMessage: true
        }));
        return;
      }
    }

    // Check if program is over
    if (i === roverIndex && programSubmitted && state.instructionsCompleted === program.length) {
      if (checkWin()) {
        setState(state => ({...state, winMessage: true})); 
      } else {
        setState(state => ({...state, loseMessage: true})); 
      }
    }

    // When rover completes its action, move on to the next instruction
    if (i === roverIndex && programSubmitted
        && state.instructionsCompleted > currentInstruction
        && state.instructionsCompleted != program.length) {

      setTimeout(() => {
        setCurrentInstruction(currentInstruction + 1);
      }, 250);
    }
  }
})));



return (
    <g>
      {itemSprings.map((spring, i) => {
        const item = items[i];
        return (<AItem
          key={i}
          object={item.object}
          x={spring.x}
          y={spring.elevation.interpolate(e => obj_y(item.object, e))}
          costumeIndex={item.costumeNumber}
          center={item.object.center !== false}
          opacity={spring.opacity}
        />);
      })}
      <a.text
        x='50%'
        y='20%'
        dominantBaseline='middle'
        textAnchor='middle'
        opacity={winSpring.opacity}
        style={{ fontSize: '80px', fill: planet.colors.text }}
      >
        Mission Success
      </a.text>
      <a.text
        x='50%'
        y='20%'
        dominantBaseline='middle'
        textAnchor='middle'
        opacity={loseSpring.opacity}
        style={{ fontSize: '80px', fill: planet.colors.text }}
      >
        Try Again
      </a.text>
    </g>
  );
}