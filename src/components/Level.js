import { useState } from 'react';
import { useSpring, animated as a } from 'react-spring';

import { Item } from './Item';

import { BLOCK_NAMES } from '../game/blocks';
import { PLANETS } from '../game/missions';
import {  obj_y } from '../game/objects';

export default ({ currentInstruction, planetIndex, missionIndex,
                  program, programSubmitted }) => {

  const planet = PLANETS[planetIndex];
  const mission = planet.missions[missionIndex];
  
  const [instructionsCompleted, setInstructionsCompleted] = useState(0);
  const [items, setItems] = useState(mission.items);

  if (programSubmitted && currentInstruction < program.length && instructionsCompleted == currentInstruction) {
    const instruction = program[currentInstruction];
    
    // Decide which instruction to use
    switch (instruction) {

      // Move the rover forward
      case BLOCK_NAMES.FORWARD:
        setInstructionsCompleted(x => x + 1);
        setItems(items => {
          const rover = items['rover'];
          return {
            ...items,
            rover: {
              ...rover,
              x: rover.x + 100
            }
          }
        });
        break;

      default:
        console.log('ERROR: Unknown block.');
    }
  }

  return (
    <g>
      {Object.keys(items).map((itemName, i) => {

        const item = items[itemName];

        // Non-agent doesn't need to move
        return <Item
          key={i}
          object={item.object}
          x={item.x}
          y={obj_y(item.object, item.elevation || 0)}
        /> 
      })}
    </g>
  );
}