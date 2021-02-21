import { useState, useEffect } from 'react';
import { useSpring, animated as a } from 'react-spring';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from './Scene';
import { PLANETS } from '../game/missions';

const START_RADIUS = 100;
const RADIUS_INCREMENT = 20;

export default ({ onCompleteIntro, planetIndex }) => {

  // Determine current planet and scale
  const planet = PLANETS[planetIndex];
  const scale = planet.introConfig.scale;

  const [resetOrbit, setResetOrbit] = useState(false);
  const [exitIntro, setExitIntro] = useState(false);

  // Fade in for sun
  const sunSpring = useSpring({
    to: {opacity: 1},
    from: {opacity: 0},
    config: {duration: 1500},
    delay: 1500,
  });

  // Fade in for planets
  const planetOpacitySpring = useSpring({
    to: {opacity: 1},
    from: {opacity: 0},
    config: {duration: 1500},
    delay: 3000
  })

  // Angle for planets' orbit
  const planetMotionSpring = useSpring({
    to: {angle: 2 * Math.PI},
    from: {angle: 0},
    config: {duration: 10000},
    reset: resetOrbit,
    onRest: () => setResetOrbit(state => !state)
  });

  // Fade out for scene
  const sceneExitSpring = useSpring({
    to: {opacity: exitIntro ? 0: 1},
    from: {opacity: 1},
    config: {duration: 2000},
    onRest: () => {
      if (exitIntro)
        onCompleteIntro();
    }
  })

  // Generate orbit and planet for each visible planet
  const renderedPlanets = PLANETS.slice(0, 1 + planetIndex).map((planet, i) => {

    const startAngle = Math.random() * 2 * Math.PI;
    const radius = START_RADIUS + RADIUS_INCREMENT * i;
    return <a.g key={i} opacity={planetOpacitySpring.opacity}>
      <a.circle
        cx={CANVAS_WIDTH / 2}
        cy={CANVAS_HEIGHT / 2}
        r={radius * scale}
        fillOpacity={0}
        stroke={'white'}
        strokeWidth={2}
      />
      <a.circle
        cx={planetMotionSpring.angle.interpolate(theta => (CANVAS_WIDTH / 2) + scale * (radius * Math.cos(theta)))}
        cy={planetMotionSpring.angle.interpolate(theta => (CANVAS_HEIGHT / 2) - scale * (radius * Math.sin(theta)))}
        r={planet.introConfig.size * scale}
        style={{ fill: planet.colors.main }}
      /> 
    </a.g>;
  });

  // Fade out intro screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setExitIntro(true);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <a.g opacity={sceneExitSpring.opacity}>

      {/* Sun */}
      <a.circle
        cx={CANVAS_WIDTH / 2}
        cy={CANVAS_HEIGHT / 2}
        r={50 * scale}
        style={{ fill: '#f0f067' }}
        opacity={sunSpring.opacity}  
      />

      {/* Other Planets */}
      {renderedPlanets}
    </a.g>
  );
}