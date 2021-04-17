// Game is divided into Planets and Missions

import { BLOCK_NAMES, EVENTS } from './blocks';
import { OBJECTS } from './objects';

// Defaults for objects
const defaults = {
  elevation: 0,
  opacity: 1,
  costumeNumber: 0,
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
      main: '#bfbaac',
      sky: '#7d705b',
      text: 'black'
    },
    briefing: 'The Tenacity rover has arrived on Mercury. Use the control panel to help Tenacity complete its missions.',
    missions: [
      {
        objective: 'Navigate Tenacity back to the spacecraft for refueling.',
        hint: 'Click on a function to add it to Tenacity\'s program. Click "Submit Instructions" when the program is ready to run.',
        blocks: [
          [BLOCK_NAMES.FORWARD, 2]
        ],
        items: [
          {...d, id: 'rocket', object: OBJECTS.ROCKET, x: 500},
          {...d, id: 'rover', object: OBJECTS.ROVER, x: 300},
        ],
        criteria: [
          {category: 'rover_x', value: 500, message: 'Tenacity did not make it back to spacecraft.'}
        ]
      },
      {
        objective: 'Get close to the crater to explore it. But be careful not to fall in!',
        blocks: [
          [BLOCK_NAMES.FORWARD, 5]
        ],
        items: [
          {...d, id: 'rocket', object: OBJECTS.ROCKET, x: 100},
          {...d, id: 'crater', object: OBJECTS.MERCURY_CRATER, x: 500, elevation: -30, allowFall: true},
          {...d, id: 'rover', object: OBJECTS.ROVER, x: 100},
        ],
        criteria: [
          {category: 'rover_x', value: 400, message: 'Tenacity did not make it close enough to crater.'}
        ]
      },
      {
        objective: 'Return the rock sample back to the rocket.',
        blocks: [
          [BLOCK_NAMES.FORWARD, 5],
          [BLOCK_NAMES.PICK_UP, 1],
          [BLOCK_NAMES.TURN, 1]
        ],
        items: [
          {...d, id: 'rocket', object: OBJECTS.ROCKET, x: 100},
          {...d, id: 'crater', object: OBJECTS.MERCURY_CRATER, x: 500, elevation: -30, allowFall: true},
          {...d, id: 'rock', object: OBJECTS.ROCK_RED, x: 400, elevation: -30},
          {...d, id: 'rover', object: OBJECTS.ROVER, x: 400},
        ],
        criteria: [
          {category: 'rover_x', value: 100, message: 'Tenacity did not make it back to rocket.'},
          {category: 'rover_carry', value: 'rock', message: 'Tenacity does not have rock sample.'},
        ]
      },
      {
        objective: "We're done here on Mercury! Launch the rocket to head to the next planet.",
        blocks: [
          [BLOCK_NAMES.LAUNCH_ROCKET, 1]
        ],
        items: [
          {...d, id: 'rocket', object: OBJECTS.ROCKET, x: 400},
          {...d, id: 'rover', object: OBJECTS.ROVER, x: 400},
        ],
        criteria: [
          {category: 'event', value: EVENTS.ROCKET_LAUNCH, message: 'Rocket did not launch.'}
        ]
      }
    ]
  },
  {
    name: 'Venus',
    introConfig: {
      size: 20,
      scale: 1.7,
      orbitDuration: 28900,
      textColor: 'black'
    },
    colors: {
      main: '#ae7c43',
      sky: '#dbb78f',
      text: 'black'
    },
    briefing: 'Welcome to Venus! Tenacity\'s mission is to explore the volcanos on the planet.',
    missions: [
      {
        objective: 'Get to the base of the volcano and take a photo.',
        hint: 'To repeat a section of a program multiple times, put it in between a "Repeat" and "End Repeat" instruction.',
        blocks: [
          [BLOCK_NAMES.FORWARD, 1],
          [BLOCK_NAMES.TAKE_PHOTO, 1],
          [BLOCK_NAMES.REPEAT, 1],
          [BLOCK_NAMES.END_REPEAT, 1],
        ],
        items: [
          {...d, id: 'volcano', object: OBJECTS.VOLCANO, x: 700},
          {...d, id: 'rocket', object: OBJECTS.ROCKET, x: 100},
          {...d, id: 'rover', object: OBJECTS.ROVER, x: 200},
        ],
        criteria: [
          {category: 'photograph', value: 700, message: 'Tenacity did not take photograph of volcano.'},
        ]
      },
      {
        objective: 'Collect the rock sample.',
        blocks: [
          [BLOCK_NAMES.FORWARD, 2],
          [BLOCK_NAMES.BRIDGE, 1],
          [BLOCK_NAMES.PICK_UP, 1],
          [BLOCK_NAMES.REPEAT, 1],
          [BLOCK_NAMES.END_REPEAT, 1],
        ],
        items: [
          {...d, id: 'crater', object: OBJECTS.VENUS_CRATER, x: 300, allowFall: true, elevation: -30},
          {...d, id: 'rock', object: OBJECTS.ROCK_RED, x: 600, elevation: -30},
          {...d, id: 'rover', object: OBJECTS.ROVER, x: 100},
        ],
        criteria: [
          {category: 'rover_carry', value: 'rock', message: 'Tenacity does not have rock sample.'},
        ]
      },
      {
        objective: 'Take photos at each of the five volcanos.',
        blocks: [
          [BLOCK_NAMES.FORWARD, 3],
          [BLOCK_NAMES.TURN, 2],
          [BLOCK_NAMES.TAKE_PHOTO, 1],
          [BLOCK_NAMES.REPEAT, 1],
          [BLOCK_NAMES.END_REPEAT, 1],
        ],
        items: [
          {...d, id: 'volcano1', object: OBJECTS.VOLCANO, x: 200},
          {...d, id: 'volcano2', object: OBJECTS.VOLCANO, x: 300},
          {...d, id: 'volcano3', object: OBJECTS.VOLCANO, x: 400},
          {...d, id: 'volcano4', object: OBJECTS.VOLCANO, x: 500},
          {...d, id: 'volcano5', object: OBJECTS.VOLCANO, x: 600},
          {...d, id: 'rover', object: OBJECTS.ROVER, x: 400},
        ],
        criteria: [
          {category: 'photograph', value: 200, message: 'Tenacity did not take photograph of all volcano.'},
          {category: 'photograph', value: 300, message: 'Tenacity did not take photograph of all volcano.'},
          {category: 'photograph', value: 400, message: 'Tenacity did not take photograph of all volcano.'},
          {category: 'photograph', value: 500, message: 'Tenacity did not take photograph of all volcano.'},
          {category: 'photograph', value: 600, message: 'Tenacity did not take photograph of all volcano.'},
        ]
      },
      {
        objective: 'Drop off both rock samples at the rocket.',
        hint: 'Tenacity can only hold one object at a time.',
        blocks: [
          [BLOCK_NAMES.FORWARD, 5],
          [BLOCK_NAMES.TURN, 1],
          [BLOCK_NAMES.BRIDGE, 1],
          [BLOCK_NAMES.PICK_UP, 1],
          [BLOCK_NAMES.DROP, 1],
          [BLOCK_NAMES.REPEAT, 1],
          [BLOCK_NAMES.END_REPEAT, 1],
        ],
        items: [
          {...d, id: 'crater1', object: OBJECTS.VENUS_CRATER, x: 400, allowFall: true, elevation: -30},
          {...d, id: 'rock1', object: OBJECTS.ROCK_RED, x: 500, elevation: -30},
          {...d, id: 'crater2', object: OBJECTS.VENUS_CRATER, x: 200, allowFall: true, elevation: -30},
          {...d, id: 'rock2', object: OBJECTS.ROCK_RED, x: 100, elevation: -30},
          {...d, id: 'rocket', object: OBJECTS.ROCKET, x: 300},
          {...d, id: 'rover', object: OBJECTS.ROVER, x: 300},
        ],
        criteria: [
          {category: 'location_x', id: 'rock1', value: 300, message: 'Both rock samples were not dropped off at rocket.'},
          {category: 'location_x', id: 'rock2', value: 300, message: 'Both rock samples were not dropped off at rocket.'},
        ]
      },
    ]
  }
]