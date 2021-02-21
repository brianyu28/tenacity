import { Item } from './Item';

import { CANVAS_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT } from '../game/constants';
import { PLANETS } from '../game/missions';
import { OBJECTS, obj_y } from '../game/objects';

export default ({ planetIndex, missionIndex }) => {

  const planet = PLANETS[planetIndex];
  const mission = planet.missions[missionIndex];

  return (
    <g>
      <text x='50%' y='50%' style={{ fill: 'black' }}>work in progress</text>
      {mission.items.map((item, i) => {
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