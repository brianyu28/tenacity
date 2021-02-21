import { CANVAS_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT,
         ROCKET_HEIGHT, ROVER_HEIGHT } from '../game/constants';
import { PLANETS } from '../game/missions';

import rocket from '../assets/rocket.svg';
import rover from '../assets/rover.svg';


export default ({ planetIndex, missionIndex }) => {

  const planet = PLANETS[planetIndex];
  const mission = planet.missions[missionIndex];

  return (
    <g>
      <text x='50%' y='50%' style={{ fill: 'black' }}>work in progress</text>
      <image
        href={rocket}
        height={ROCKET_HEIGHT}
        x="500"
        y={CANVAS_HEIGHT - GROUND_HEIGHT - ROCKET_HEIGHT}
      />
      <image
        href={rover}
        height={ROVER_HEIGHT}
        x="200"
        y={CANVAS_HEIGHT - GROUND_HEIGHT - ROVER_HEIGHT}
      />
    </g>
  );
}