import rocket from '../assets/rocket.svg';
import rover from '../assets/rover.svg';

import { CANVAS_HEIGHT, GROUND_HEIGHT } from './constants';

export const OBJECTS = {
  ROVER: {
    image: rover,
    height: 80,
    width: 80
  },
  ROCKET: {
    image: rocket,
    height: 100,
    width: 57
  }
}

// Get y position of object based on its elevation off the ground
export const obj_y = (object, elevation = 0) => (
  CANVAS_HEIGHT - GROUND_HEIGHT - object.height - elevation 
)