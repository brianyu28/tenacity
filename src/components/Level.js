import { useState, useEffect } from 'react';
import { useSpring, useSprings, animated as a } from 'react-spring';

import Item from './Item';

import { CANVAS_WIDTH } from '../game/constants';
import { getMissionLabel, logEvent } from '../analytics';
import { BLOCK_NAMES, EVENTS } from '../game/blocks';
import { PLANETS } from '../game/missions';
import { OBJECTS, obj_y } from '../game/objects';

const STEP_SIZE = 100;
const PADDING = 20;

const AItem = a(Item);

const Level = ({ planetIndex, missionIndex, onSuccess, onFailure, program, programSubmitted }) => {

  const planet = PLANETS[planetIndex];
  const mission = planet.missions[missionIndex];

  useEffect(() => {
    logEvent({
      category: 'Level',
      action: 'Start Level',
      label: getMissionLabel(planetIndex, missionIndex)
    });
  }, [missionIndex, planetIndex]);

  const [state, setState] = useState({
    startTime: new Date(),
    currentInstruction: 0,
    instructionsCompleted: 0,
    items: mission.items,
    winMessage: false,
    loseMessage: false,
    photographs: [], // x locations of photographs
    bridges: [], // x locations of bridges
    buttons: [], // ids of buttons that have been pressed
    variables: mission.variables.map(variable => ({...variable})), // values for variables
    loopMetadata: {}, // how many times has each loop run so far
    events: [] // events that have taken place
  });

  const { startTime, currentInstruction, instructionsCompleted, items, photographs,
          bridges, buttons, variables, winMessage, loseMessage } = state;

  // Determine index of rover
  const roverIndex = items.findIndex(item => item.id === 'rover');
  const rover = roverIndex !== -1 ? items[roverIndex] : null;
  const rocketIndex = items.findIndex(item => item.id === 'rocket');
  const rocket = rocketIndex !== -1 ? items[rocketIndex] : null;

  // Check if level is won
  function checkWin() {
    for (let i = 0; i < mission.criteria.length; i++) {
      if (!checkCriteria(mission.criteria[i])) {
        return {isWin: false, message: mission.criteria[i].message || true};
      }
    }
    return {isWin: true};
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

      case 'location_x':
        for (const item of items) {
          if (item.id === criterion.id && item.x === criterion.value) {
            return true;
          }
        }
        return false;

      case 'rover_carry':
        for (const item of items) {
          if (item.id === criterion.value && item.carried === true) {
            return true;
          }
        }
        return false;
      
      // Confirm that event took place
      case 'event':
        for (const event of state.events) {
          if (criterion.value === event) {
            return true;
          }
        }
        return false;

      case 'photograph':
        for (const photograph of photographs)  {
          if (criterion.value === photograph) {
            return true;
          };
        }
        return false;

      case 'button_press':
        // If button is pressed, return true if that was the goal, false otherwise
        for (const button of buttons) {
          if (button === criterion.id) {
            return criterion.value;
          }
        }
        return !criterion.value;

      default:
        console.log('Error: Unknown criterion.');
        return false;
    }

  }

  // Check to see if item will fall into something that allows falling
  function checkFall(target) {
    
    // If there's a bridge at target's x elevation, don't fall
    for (const bridge of bridges) {
      if (bridge === target.x) {
        return false;
      }
    }

    // If there's no bridge, check for an item that allows falling
    for (const item of items) {
      if (item.allowFall && item.x === target.x && target.elevation === 0) {
        return true;
      }
    }
    return false;
  }

  // Checks if a bridge can be built at a particular x location
  // Bridges can only be built over fallable items
  function canBuildBridge(x) {
    for (const item of items) {
      if (item.allowFall && item.x === x) {
        return true;
      }
    }
    return false;
  }

  // Get object to pick up; closest object to rover, null if none
  function getPickupObject() {
    let obj = null; 
    for (const item of items) {
      if (!item.carried && item.canCarry &&
          item !== rover && item.x === rover.x && (obj === null || item.elevation > obj.elevation)) {
        obj = item;
      }
    }
    return obj;
  }

  // Get the object that is currently carried
  function getCarriedObject() {
    for (const item of items) {
      if (item.carried) {
        return item;
      }
    }
    return null;
  }

  // Get the button where the rover currently is
  function getCurrentButton() {
    for (const item of items) {
      if (item.button === true && item.x === rover.x) {
        return item;
      }
    }
    return null;
  }

  function getVariableValue(name) {
    for (const variable of variables) {
      if (variable.name === name) {
        return variable.value;
      }
    }
    return null;
  }

  // Takes a list of items and returns items with the util value for the rover flipped
  // Doesn't functionally change anything about the items, but triggers an animation
  function roverNoop(items) {
    return items.map((item, i) => i === roverIndex ? {
      ...rover,
      util: (rover.util || 0) + 1
    } : item);
  }

  // Run an instruction
  if (programSubmitted && currentInstruction < program.length &&
      instructionsCompleted === currentInstruction && !winMessage && !loseMessage) {
    const instruction = program[currentInstruction];

    // Decide which instruction to use
    let obj;
    let instr;
    switch (instruction.block) {

      // Move the rover forward
      case BLOCK_NAMES.FORWARD:
        setState(state => ({
          ...state,
          instructionsCompleted: state.instructionsCompleted + 1,
          items: state.items.map((item, i) => i === roverIndex || item.carried === true ? {
              ...item,
              x: rover.costumeNumber === 0 ? item.x + STEP_SIZE : item.x - STEP_SIZE
            } : item),
        }));
        break;

        case BLOCK_NAMES.FORWARD_VAR:
          let amt = getVariableValue(instruction.args.var);
          setState(state => ({
            ...state,
            instructionsCompleted: state.instructionsCompleted + 1,
            items: state.items.map((item, i) => i === roverIndex || item.carried === true ? {
                ...item,
                x: rover.costumeNumber === 0 ? item.x + amt * STEP_SIZE : item.x - amt * STEP_SIZE
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
        obj = getPickupObject();
        if (obj !== null) {
          setState(state => ({
            ...state,
            instructionsCompleted: state.instructionsCompleted + 1,
            items: state.items.map((item, i) => item === obj ? {
              ...obj,
              elevation: 30,
              prevElevation: obj.elevation,
              carried: true
            } : i === roverIndex ? {
              ...rover,
              util: (rover.util || 0) + 1
            } : item),
          }))
        } else {
          setState(state => ({
            ...state,
            instructionsCompleted: state.instructionsCompleted + 1,
            items: roverNoop(state.items),
          }));
        }
        break;

      case BLOCK_NAMES.DROP:
        obj = getCarriedObject();
        if (obj !== null) {
          setState(state => ({
            ...state,
            instructionsCompleted: state.instructionsCompleted + 1,
            items: state.items.map((item, i) => item === obj ? {
              ...obj,
              elevation: obj.prevElevation,
              carried: false
            } : i === roverIndex ? {
              ...rover,
              util: (rover.util || 0) + 1,
            } : item),
          }));
        } else {
          setState(state => ({
            ...state,
            instructionsCompleted: state.instructionsCompleted + 1,
            items: roverNoop(state.items),
          }));
        }
        break;

      case BLOCK_NAMES.LAUNCH_ROCKET:
        const shouldLaunch = rocket && rover && rocket.x === rover.x;
        setState(state => ({
          ...state,
          instructionsCompleted: state.instructionsCompleted + 1,
          items: shouldLaunch ?
            state.items.map((item, i) =>
              i === roverIndex ? {
                ...rover,
                opacity: -10
              } :
              i === rocketIndex ? {
                ...rocket,
                elevation: 600
              } : item
            )
          : state.items,
          events: [...state.events, EVENTS.ROCKET_LAUNCH]
        }));
        break;

      case BLOCK_NAMES.REPEAT:
        const iterationsCompleted = state.loopMetadata[instruction.meta.id] || 0;

        // Done looping
        if (iterationsCompleted >= instruction.args.count) {
          setState(state => ({
            ...state,
            currentInstruction: instruction.meta.jumpTo - 1,
            instructionsCompleted: instruction.meta.jumpTo,
            items: roverNoop(state.items),
          }));

        // Need to loop more
        } else {
          setState(state => ({
            ...state,
            currentInstruction: state.currentInstruction + 1,
            instructionsCompleted: state.instructionsCompleted + 1,
            items: roverNoop(state.items),
            loopMetadata: {
              ...state.loopMetadata,
              [instruction.meta.id]: iterationsCompleted + 1
            }
          }));
        }
        break;

      case BLOCK_NAMES.END_REPEAT:
        setState(state => ({
          ...state,
          currentInstruction: instruction.meta.jumpBackTo,
          instructionsCompleted: instruction.meta.jumpBackTo,
          items: roverNoop(state.items),
        }));
        break;

      case BLOCK_NAMES.IF_BUTTON_BLUE:
        let blue_button = false;
        for (const item of items) {
          if (item.x === rover.x && item.object === OBJECTS.BUTTON_BLUE) {
            blue_button = true;
            break;
          }
        }
        if (blue_button) {
          setState(state => ({
            ...state,
            instructionsCompleted: state.instructionsCompleted + 1,
            items: roverNoop(state.items),
          }));
        } else {
          instr = instruction.meta.elseJump === undefined ? instruction.meta.jumpTo : instruction.meta.elseJump;
          setState(state => ({
            ...state,
            currentInstruction: instr - 1,
            instructionsCompleted: instr,
            items: roverNoop(state.items),
          }));
        }
        break;

      case BLOCK_NAMES.IF_CARRYING_BLUE:
        obj = getCarriedObject();
        if (obj && obj.color === 'blue') {
          setState(state => ({
            ...state,
            instructionsCompleted: state.instructionsCompleted + 1,
            items: roverNoop(state.items),
          }));
        } else {
          instr = instruction.meta.elseJump === undefined ? instruction.meta.jumpTo : instruction.meta.elseJump;
          setState(state => ({
            ...state,
            currentInstruction: instr - 1,
            instructionsCompleted: instr,
            items: roverNoop(state.items),
          }));
        }
        break;

      case BLOCK_NAMES.ELSE:
        instr = instruction.meta.jumpTo;
        setState(state => ({
          ...state,
          currentInstruction: instr - 1,
          instructionsCompleted: instr,
          items: roverNoop(state.items),
        }));
        break;

      case BLOCK_NAMES.END_IF:
        setState(state => ({
          ...state,
          instructionsCompleted: state.instructionsCompleted + 1,
          items: roverNoop(state.items),
        }));
        break;

      case BLOCK_NAMES.PRESS_BUTTON:
        obj = getCurrentButton();
        if (obj !== null) {
          setState(state => ({
            ...state,
            instructionsCompleted: state.instructionsCompleted + 1,
            buttons: [...state.buttons, obj.id],
            items: state.items.map((item, i) => item.id === obj.id ?
              {
                ...item,
                costumeNumber: 1 
              }
              : item
            ),
          }));
        } else {
          setState(state => ({
            ...state,
           loseMessage: 'Tenacity tried to press a button that wasn\'t there.'
          }));
        }
        break;

      case BLOCK_NAMES.TAKE_PHOTO:
        setState(state => ({
          ...state,
          instructionsCompleted: state.instructionsCompleted + 1,
          photographs: [...state.photographs, rover.x],
          items: roverNoop(state.items),
        }));
        break;

      case BLOCK_NAMES.BRIDGE:
        const bridgeX = rover.costumeNumber === 0 ? rover.x + STEP_SIZE : rover.x - STEP_SIZE;
        if (canBuildBridge(bridgeX)) {
          setState(state => ({
            ...state,
            instructionsCompleted: state.instructionsCompleted + 1,
            bridges: [...state.bridges, bridgeX],
            items: roverNoop(state.items),
          }));
        } else {
          setState(state => ({
            ...state,
           loseMessage: 'Tenacity can only build bridges over craters.'
          }));
        }
        break;

      case BLOCK_NAMES.INCREMENT_VAR:
        setState(state => ({
          ...state,
          instructionsCompleted: state.instructionsCompleted + 1,
          variables: state.variables.map((variable) => (
            variable.name === instruction.args.var ?
            {
              ...variable,
              value: variable.value + 1
            }
            : variable
          )),
          items: roverNoop(state.items),
        }));
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
          loseMessage: 'Tenacity fell into crater.'
        }));
        return;
      }
    }

    // Check if program is over
    if (i === roverIndex && programSubmitted && state.instructionsCompleted === program.length) {
      const { isWin, message } = checkWin();
      if (isWin) {
        setState(state => ({...state, winMessage: true})); 
      } else {
        setState(state => ({...state, loseMessage: message})); 
      }
    }

    // When rover completes its action, move on to the next instruction
    if (i === roverIndex && programSubmitted
        && state.instructionsCompleted > currentInstruction
        && state.instructionsCompleted !== program.length) {

      setTimeout(() => {
        setState(state => ({
          ...state,
          currentInstruction: state.currentInstruction + 1
        }));
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
      {
        bridges.map((x, i) => {
          const bridge = OBJECTS.BRIDGE;
          return (<AItem
            key={i}
            object={bridge}
            x={x}
            y={obj_y(bridge, -bridge.height)}
            costumeIndex={0}
            center={true}
            opacity={1}
          />);
        })
      }
      {
        photographs.map((x, i) => {
          const photograph = OBJECTS.PHOTOGRAPH;
          return (<AItem
            key={i}
            object={photograph}
            x={x}
            y={obj_y(photograph, -80)}
            costumeIndex={0}
            center={true}
            opacity={1}
          />);
        })
      }
      {
        variables.map((variable, i) => {
          return (<text
            key={i}
            textAnchor='end'
            dominantBaseline='hanging'
            x={CANVAS_WIDTH - PADDING}
            y={PADDING + (24) * (i + 1)}
            style={{ fill: planet.colors.text, fontSize: '20px', fontFamily: 'monospace' }}
          >
            {variable.name}: {variable.value}
          </text>)
        })
      }
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
      <a.text
        x='50%'
        y='35%'
        dominantBaseline='middle'
        textAnchor='middle'
        opacity={loseSpring.opacity}
        style={{ fontSize: '30px', fill: planet.colors.text }}
      >
        {loseMessage === true ? '' : loseMessage}
      </a.text>
    </g>
  );
}

export default Level;