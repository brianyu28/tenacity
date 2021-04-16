import { CANVAS_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT } from '../game/constants';

const SHOW_TICKS = true;
const TICK_INTERVAL = 100;
const TICK_WIDTH = 1;
const TICK_HEIGHT = 10;

const Ground = ({ planet }) => {
  return (
    <g>
      <rect
        x={0} y={CANVAS_HEIGHT - GROUND_HEIGHT} width={CANVAS_WIDTH} height={GROUND_HEIGHT}
        fill={planet.colors.main}
      />
      {SHOW_TICKS && [...Array(CANVAS_WIDTH / TICK_INTERVAL).keys()].map(i => {
        return <rect
          key={i}
          x={i * TICK_INTERVAL - (TICK_WIDTH / 2)}
          y={CANVAS_HEIGHT - GROUND_HEIGHT}
          width={TICK_WIDTH}
          height={TICK_HEIGHT}
        />
      })}
    </g>
  );
}

export default Ground;