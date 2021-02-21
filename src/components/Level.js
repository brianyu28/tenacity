import { useState } from 'react';
import { useSpring, animated as a } from 'react-spring';

import { Item } from './Item';

import { BLOCK_NAMES } from '../game/blocks';
import { PLANETS } from '../game/missions';
import {  obj_y } from '../game/objects';

const AItem = a(Item);

export default ({ currentInstruction, planetIndex, missionIndex,
                  setCurrentInstruction, program, programSubmitted }) => {

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
              x: rover.x + 100,
              prev: {
                x: rover.x + 100
              }
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

        const itemSpring = useSpring({
          to: {x: item.x, elevation: item.elevation || 0},
          from: {
            x: (item.prev && item.prev.x) ? item.prev.x : item.x,
            elevation: (item.prev && item.prev.elevation) ? item.prev.elevation : item.elevation || 0
          },
          config: {duration: 1000},
          onRest: () => {
            if (itemName === 'rover' && programSubmitted && instructionsCompleted > currentInstruction) {
              setTimeout(() => {
                setCurrentInstruction(currentInstruction + 1);
              }, 250);
            }
          }
        });

        // Non-agent doesn't need to move
        return <AItem
          key={i}
          object={item.object}
          x={itemSpring.x}
          y={itemSpring.elevation.interpolate(e => obj_y(item.object, e))}
        /> 
      })}
    </g>
  );
}