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
          {...d, id: 'rock', object: OBJECTS.ROCK_RED, x: 400, elevation: -30, canCarry: true},
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
          {...d, id: 'rock', object: OBJECTS.ROCK_RED, x: 600, elevation: -30, canCarry: true},
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
          {...d, id: 'crater1', object: OBJECTS.VENUS_CRATER, x: 500, allowFall: true, elevation: -30},
          {...d, id: 'rock1', object: OBJECTS.ROCK_BLUE, x: 600, elevation: -30, canCarry: true},
          {...d, id: 'crater2', object: OBJECTS.VENUS_CRATER, x: 300, allowFall: true, elevation: -30},
          {...d, id: 'rock2', object: OBJECTS.ROCK_BLUE, x: 200, elevation: -30, canCarry: true},
          {...d, id: 'rocket', object: OBJECTS.ROCKET, x: 400},
          {...d, id: 'rover', object: OBJECTS.ROVER, x: 400},
        ],
        criteria: [
          {category: 'location_x', id: 'rock1', value: 400, message: 'Both rock samples were not dropped off at rocket.'},
          {category: 'location_x', id: 'rock2', value: 400, message: 'Both rock samples were not dropped off at rocket.'},
        ]
      },
      {
        objective: "We're done here on Venus! Launch the rocket to head to the next planet.",
        blocks: [
          [BLOCK_NAMES.LAUNCH_ROCKET, 1]
        ],
        items: [
          {...d, id: 'crater1', object: OBJECTS.VENUS_CRATER, x: 500, allowFall: true, elevation: -30},
          {...d, id: 'crater2', object: OBJECTS.VENUS_CRATER, x: 300, allowFall: true, elevation: -30},
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
    name: 'Earth',
    introConfig: {
      size: 21,
      scale: 1.3,
      orbitDuration: 47000,
      textColor: 'black'
    },
    colors: {
      main: '#34bf9a',
      sky: '#9df2ee',
      text: 'black'
    },
    briefing: 'The Tenacity rover has arrived on Earth. Deliver the rock samples to the lab before proceeding to the next planet.',
    missions: [
      {
        objective: 'Unlock the lab. To unlock the lab, press all of the blue buttons without pressing the red button.',
        hint: 'Any instructions between an "If" and an "End If" instruction will only run if the "If" condition is true.',
        blocks: [
          [BLOCK_NAMES.FORWARD, 1],
          [BLOCK_NAMES.PRESS_BUTTON, 1],
          [BLOCK_NAMES.REPEAT, 1],
          [BLOCK_NAMES.END_REPEAT, 1],
          [BLOCK_NAMES.IF_BUTTON_BLUE, 1],
          [BLOCK_NAMES.END_IF, 1],
        ],
        items: [
          {...d, id: 'rocket', object: OBJECTS.ROCKET, x: 100},
          {...d, id: 'lab', object: OBJECTS.LAB, x: 400},
          {...d, id: 'button1', object: OBJECTS.BUTTON_BLUE, x: 400, elevation: 70, button: true},
          {...d, id: 'button2', object: OBJECTS.BUTTON_RED, x: 500, elevation: 70, button: true},
          {...d, id: 'button3', object: OBJECTS.BUTTON_BLUE, x: 600, elevation: 70, button: true},
          {...d, id: 'rover', object: OBJECTS.ROVER, x: 300},
        ],
        criteria: [
          {category: 'button_press', id: 'button1', value: true, message: 'Tenacity did not press all blue buttons.'},
          {category: 'button_press', id: 'button2', value: false, message: 'Tenacity pressed a red button.'},
          {category: 'button_press', id: 'button3', value: true, message: 'Tenacity did not press all blue buttons.'},
        ]
      },
      {
        objective: 'There is one rock sample in the "Samples" box. Move it to the appropriately labeled color box.',
        hint: 'Red rocks should go to the "Red" box and blue rocks should go to the "Blue" box.',
        blocks: [
          [BLOCK_NAMES.FORWARD, 5],
          [BLOCK_NAMES.PICK_UP, 1],
          [BLOCK_NAMES.DROP, 1],
          [BLOCK_NAMES.IF_CARRYING_BLUE, 1],
          [BLOCK_NAMES.END_IF, 1],
        ],
        items: [
          {...d, id: 'rock', object: OBJECTS.ROCK_BLUE, x: 200, elevation: -50, canCarry: true, color: 'blue'},
          {...d, id: 'box_samples', object: OBJECTS.BOX_SAMPLES, x: 200, elevation: -100},
          {...d, id: 'box_red', object: OBJECTS.BOX_RED, x: 400, elevation: -100},
          {...d, id: 'box_blue', object: OBJECTS.BOX_BLUE, x: 500, elevation: -100},
          {...d, id: 'rover', object: OBJECTS.ROVER, x: 200},
        ],
        criteria: [
          {category: 'location_x', id: 'rock', value: 500, message: 'Rock sample did not end up in blue box.'},
        ]
      },
      {
        objective: 'There is one rock sample in the "Samples" box. Move it to the appropriately labeled color box.',
        blocks: [
          [BLOCK_NAMES.FORWARD, 5],
          [BLOCK_NAMES.PICK_UP, 1],
          [BLOCK_NAMES.DROP, 1],
          [BLOCK_NAMES.IF_CARRYING_BLUE, 1],
          [BLOCK_NAMES.ELSE, 1],
          [BLOCK_NAMES.END_IF, 1],
        ],
        items: [
          {...d, id: 'rock', object: OBJECTS.ROCK_RED, x: 200, elevation: -50, canCarry: true, color: 'red'},
          {...d, id: 'box_samples', object: OBJECTS.BOX_SAMPLES, x: 200, elevation: -100},
          {...d, id: 'box_red', object: OBJECTS.BOX_RED, x: 500, elevation: -100},
          {...d, id: 'box_blue', object: OBJECTS.BOX_BLUE, x: 400, elevation: -100},
          {...d, id: 'rover', object: OBJECTS.ROVER, x: 200},
        ],
        criteria: [
          {category: 'location_x', id: 'rock', value: 500, message: 'Rock sample did not end up in red box.'},
        ]
      },
      {
        objective: 'There are three rock samples in the "Samples" box. Move each of them to the appropriately labeled color box.',
        blocks: [
          [BLOCK_NAMES.FORWARD, 7],
          [BLOCK_NAMES.TURN, 4],
          [BLOCK_NAMES.PICK_UP, 1],
          [BLOCK_NAMES.DROP, 2],
          [BLOCK_NAMES.IF_CARRYING_BLUE, 1],
          [BLOCK_NAMES.ELSE, 1],
          [BLOCK_NAMES.END_IF, 1],
          [BLOCK_NAMES.REPEAT, 1],
          [BLOCK_NAMES.END_REPEAT, 1],
        ],
        items: [
          {...d, id: 'rock1', object: OBJECTS.ROCK_RED, x: 200, elevation: -50, canCarry: true, color: 'red'},
          {...d, id: 'rock2', object: OBJECTS.ROCK_BLUE, x: 200, elevation: -51, canCarry: true, color: 'blue'},
          {...d, id: 'rock3', object: OBJECTS.ROCK_RED, x: 200, elevation: -52, canCarry: true, color: 'red'},
          {...d, id: 'box_samples', object: OBJECTS.BOX_SAMPLES, x: 200, elevation: -100},
          {...d, id: 'box_red', object: OBJECTS.BOX_RED, x: 400, elevation: -100},
          {...d, id: 'box_blue', object: OBJECTS.BOX_BLUE, x: 500, elevation: -100},
          {...d, id: 'rover', object: OBJECTS.ROVER, x: 200},
        ],
        criteria: [
          {category: 'location_x', id: 'rock1', value: 400, message: 'Red rock sample did not end up in red box.'},
          {category: 'location_x', id: 'rock2', value: 500, message: 'Blue rock sample did not end up in blue box.'},
          {category: 'location_x', id: 'rock3', value: 400, message: 'Red rock sample did not end up in red box.'},
        ]
      }, 
      {
        objective: "We're done here on Earth! Launch the rocket to head to the next planet.",
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
    name: 'Mars',
    introConfig: {
      size: 11,
      scale: 1,
      orbitDuration: 88000,
      textColor: 'black'
    },
    colors: {
      main: '#942c25',
      sky: '#e67870',
      text: 'black'
    },
    briefing: 'The Tenacity rover has arrived on Mars, the last planet on this journey.',
    missions: [
      {
        objective: 'Take a photograph at the base of the mountain.',
        hint: 'Tenacity store data in variables, found in the upper right. Some instructions let you type the name of a variable to control how the instruction behaves.',
        variables: [
          {name: 'x', value: 0},
        ],
        blocks: [
          [BLOCK_NAMES.FORWARD_VAR, 1],
          [BLOCK_NAMES.INCREMENT_VAR, 4],
          [BLOCK_NAMES.TAKE_PHOTO, 1],
        ],
        items: [
          {...d, id: 'rocket', object: OBJECTS.ROCKET, x: 100},
          {...d, id: 'mountain', object: OBJECTS.MOUNTAIN, x: 500},
          {...d, id: 'rover', object: OBJECTS.ROVER, x: 200},
        ],
        criteria: [
          {category: 'photograph', value: 500, message: 'Tenacity did not take photograph of mountain.'},
        ]
      },
    ]
  },
]