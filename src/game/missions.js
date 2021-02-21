// Game is divided into Planets and Missions

import { BLOCK_NAMES } from './blocks';
import { OBJECTS } from './objects';

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
          [BLOCK_NAMES.FORWARD, 1]
        ],
        items: {
          'rocket': {object: OBJECTS.ROCKET, x: 500},
          'rover': {object: OBJECTS.ROVER, x: 400},
        },
        criteria: [
          {category: 'rover_x', value: 500}
        ]
      },
      {
        objective: 'Mission 2 Objective'
      }
    ]
  },
  {
    name: 'Venus'
  }
]