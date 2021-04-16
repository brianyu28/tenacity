import rocket from '../assets/rocket.svg';
import rover from '../assets/rover.svg';
import rover_flipped from '../assets/rover_flipped.svg';
import mercury_crater from '../assets/mercury_crater.svg';
import rock_red from '../assets/rock_red.svg';
import volcano from '../assets/volcano.svg';

import { CANVAS_HEIGHT, GROUND_HEIGHT } from './constants';

export const OBJECTS = {
  ROVER: {
    images: [rover, rover_flipped],
    height: 80,
    width: 80
  },
  ROCKET: {
    images: [rocket],
    height: 100,
    width: 57
  },
  MERCURY_CRATER: {
    images: [mercury_crater],
    height: 30,
    width: 90
  },
  ROCK_RED: {
    images: [rock_red],
    height: 30,
    width: 40
  },
  VOLCANO: {
    images: [volcano],
    height: 100,
    width: 100,
  }
}

// Get y position of object based on its elevation off the ground
export const obj_y = (object, elevation = 0) => (
  CANVAS_HEIGHT - GROUND_HEIGHT - object.height - elevation 
)