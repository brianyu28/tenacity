import { CANVAS_WIDTH } from '../game/constants';

const PADDING = 15;
const CIRCLE_RADIUS = 20;

const ProgressIndicator = ({ planet, completedMissions }) => {
  return (
    <g>
      <text
        textAnchor='end'
        dominantBaseline='hanging'
        x={CANVAS_WIDTH - PADDING}
        y={PADDING}
        style={{ fill: planet.colors.text, fontSize: '24px' }}
      >
        {planet.name}
      </text>

      {planet.missions.map((mission, i) => {
        return (
          <circle
            key={i}
            cx={PADDING + CIRCLE_RADIUS + (CIRCLE_RADIUS * 2 + PADDING) * i}
            cy={PADDING + CIRCLE_RADIUS}
            r={CIRCLE_RADIUS}
            style={{
                fill: completedMissions > i ? planet.colors.main : 'rgba(0, 0, 0, 0)',
                stroke: planet.colors.main,
                strokeWidth: completedMissions > i ? 0 : 1
            }}
          />
        )
      })}
    </g>
  )
};

export default ProgressIndicator;