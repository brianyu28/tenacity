import { useState, useEffect } from 'react';
import { useSpring, animated as a } from 'react-spring';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../game/constants';
import { PLANETS } from '../game/missions';

const START_RADIUS = 100;
const RADIUS_INCREMENT = 50;

const PlanetIntro = ({ onCompleteIntro, onZoomIntro, planetIndex }) => {

  // Determine current planet and scale
  const planet = PLANETS[planetIndex];
  const scale = planet.introConfig.scale;

  // State to keep track of stage in animation
  const [resetOrbit, setResetOrbit] = useState(false);
  const [exitIntro, setExitIntro] = useState(false);
  const [planetZoom, setPlanetZoom] = useState(false);
  const [planetText, setPlanetText] = useState(false);

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
    to: {angle: 4 * Math.PI},
    from: {angle: 0},
    config: {duration: 20000},
    reset: resetOrbit,
    onRest: () => setResetOrbit(state => !state)
  });

  // Planet zoom
  const planetZoomSpring = useSpring({
    to: {zoom: planetZoom ? 1 : 0},
    from: {zoom: 0},
    config: {duration: 1000},
    onRest: () => {
      if (planetZoom) {
        onZoomIntro();
        setPlanetText(true);
      } 
    }
  });

  // Fade out for scene
  const sceneExitSpring = useSpring({
    to: {opacity: exitIntro ? 0: 1},
    from: {opacity: 1},
    config: {duration: 2000},
    onRest: () => {
      if (exitIntro) {
        onCompleteIntro();
      }
    }
  });

  // Fade in for planet text
  const planetTextSpring = useSpring({
    to: {opacity: planetText ? 1: 0},
    from: {opacity: 0},
    config: {duration: 1000},
    onRest: () => {
      if (planetText) {
        setTimeout(() => {
          setExitIntro(true);
        }, 2000);
      }
    }
  })

  // Generate orbit and planet for each visible planet
  const renderedPlanets = PLANETS.slice(0, 1 + planetIndex).map((planet, i) => {

    const isLastPlanet = i == planetIndex;

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
        cx={planetMotionSpring.angle.interpolate(theta =>
          (CANVAS_WIDTH / 2) + scale * (radius * Math.cos(theta * (10000 / planet.introConfig.orbitDuration))))
        }
        cy={planetMotionSpring.angle.interpolate(theta =>
          (CANVAS_HEIGHT / 2) - scale * (radius * Math.sin(theta * (10000 / planet.introConfig.orbitDuration))))
        }
        r={isLastPlanet ?
            planetZoomSpring.zoom.interpolate(zoom => 
              planet.introConfig.size * scale + zoom * (1600 - planet.introConfig.size * scale)
            )
            : planet.introConfig.size * scale}
        style={{ fill: planet.colors.main }}
      /> 
    </a.g>;
  });

  // Fade out intro screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setPlanetZoom(true);
    }, 10000);
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

      <a.text
        x='50%'
        y='50%'
        dominantBaseline='middle'
        textAnchor='middle'
        style={{ fontSize: '80px', fill: planet.introConfig.textColor }}
        opacity={planetTextSpring.opacity}
      >
        {planet.name}
      </a.text>
    </a.g>
  );
}

export default PlanetIntro;