import ReactGA from 'react-ga';

import { PLANETS } from './game/missions.js';

ReactGA.initialize('UA-123778931-5');

const logAnalytics = process.env.NODE_ENV != 'development';

export const getMissionLabel = (planetIndex, missionIndex) => {
  return `${PLANETS[planetIndex].name}, Mission ${missionIndex + 1}`;
}

export const logPageview = () => {
  if (logAnalytics) {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
}

export const logEvent = (event) => {
  if (logAnalytics) {
    ReactGA.event(event);
  }
}