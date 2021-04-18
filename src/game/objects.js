import button_red_unpressed from '../assets/button_red_unpressed.svg';
import button_red_pressed from '../assets/button_red_pressed.svg';
import button_blue_unpressed from '../assets/button_blue_unpressed.svg';
import button_blue_pressed from '../assets/button_blue_pressed.svg';
import bridge from '../assets/bridge.svg';
import lab from '../assets/lab.svg';
import rocket from '../assets/rocket.svg';
import rover from '../assets/rover.svg';
import rover_flipped from '../assets/rover_flipped.svg';
import mercury_crater from '../assets/mercury_crater.svg';
import venus_crater from '../assets/mercury_crater.svg';
import rock_blue from '../assets/rock_blue.svg';
import rock_red from '../assets/rock_red.svg';
import volcano from '../assets/volcano.svg';
import mountain from '../assets/mountain.svg';
import photograph from '../assets/photograph.svg';
import box_samples from '../assets/box_samples.svg';
import box_red from '../assets/box_red.svg';
import box_blue from '../assets/box_blue.svg';

import { CANVAS_HEIGHT, GROUND_HEIGHT } from './constants';

export const OBJECTS = {
  BRIDGE: {
    images: [bridge],
    height: 13.5,
    width: 90
  },
  BOX_SAMPLES: {
    images: [box_samples],
    height: 90,
    width: 90
  },
  BOX_RED: {
    images: [box_red],
    height: 90,
    width: 90
  },
  BOX_BLUE: {
    images: [box_blue],
    height: 90,
    width: 90
  },
  ROVER: {
    images: [rover, rover_flipped],
    height: 80,
    width: 80
  },
  BUTTON_BLUE: {
    images: [button_blue_unpressed, button_blue_pressed],
    height: 40,
    width: 40
  },
  BUTTON_RED: {
    images: [button_red_unpressed, button_red_pressed],
    height: 40,
    width: 40
  },
  ROCKET: {
    images: [rocket],
    height: 100,
    width: 57
  },
  LAB: {
    images: [lab],
    height: 250,
    width: 150 
  },
  MERCURY_CRATER: {
    images: [mercury_crater],
    height: 30,
    width: 90
  },
  VENUS_CRATER: {
    images: [venus_crater],
    height: 30,
    width: 90
  },
  ROCK_RED: {
    images: [rock_red],
    height: 30,
    width: 40
  },
  ROCK_BLUE: {
    images: [rock_blue],
    height: 30,
    width: 40
  },
  VOLCANO: {
    images: [volcano],
    height: 100,
    width: 100,
  },
  MOUNTAIN: {
    images: [mountain],
    height: 100,
    width: 100,
  },
  PHOTOGRAPH: {
    images: [photograph],
    height: 60,
    width: 60
  }
}

// Get y position of object based on its elevation off the ground
export const obj_y = (object, elevation = 0) => (
  CANVAS_HEIGHT - GROUND_HEIGHT - object.height - elevation 
)