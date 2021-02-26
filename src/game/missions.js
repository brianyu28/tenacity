// Game is divided into Planets and Missions

import { BLOCK_NAMES } from './blocks';
import { OBJECTS } from './objects';

// Defaults for objects
const defaults = {
  elevation: 0,
  costumeNumber: 0
}
const d = defaults;

export const PLANETS = [
  {
    name: 'Mercury',
    introConfig: {
      size: 15,
      scale: 2,
      orbitDuration: 10000,
      textColor: 'black'
    },
    colors: {
      main: '#ae7c43',
      sky: '#dbb78f',
      text: 'black'
    },
    briefing: 'The Tenacity rover has arrived on Mercury. Use the control panel to help Tenacity complete its missions.',
    missions: [
      {
        objective: 'Navigate Tenacity back to the spacecraft for refueling.',
        blocks: [
          [BLOCK_NAMES.FORWARD, 2]
        ],
        items: {
          'rocket': {...d, object: OBJECTS.ROCKET, x: 500},
          'rover': {...d, object: OBJECTS.ROVER, x: 300},
        },
        criteria: [
          {category: 'rover_x', value: 500}
        ]
      },
      {
        objective: 'Get close to the crater to explore it. But be careful not to fall in!',
        hint: 'You do not always need to use every block available to you.',
        blocks: [
          [BLOCK_NAMES.FORWARD, 5]
        ],
        items: {
          'rocket': {...d, object: OBJECTS.ROCKET, x: 100},
          'rover': {...d, object: OBJECTS.ROVER, x: 100},
          'crater': {...d, object: OBJECTS.MERCURY_CRATER, x: 500, elevation: -30, allowFall: true}
        },
        criteria: [
          {category: 'rover_x', value: 400}
        ]
      }
    ]
  }
]