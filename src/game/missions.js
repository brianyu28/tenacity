// Game is divided into Planets and Missions

export const PLANETS = [
  {
    name: 'Mercury',
    introConfig: {
      size: 15,
      scale: 2,
      orbitDuration: 10000
    },
    colors: {
      main: '#ae7c43',
      sky: '#dbb78f'
    },
    missions: [
      {
        objective: 'Mission 1 Objective'
      },
      {
        objective: 'Mission 2 Objective'
      }
    ]
  },
  {
    name: 'Venus'
  }
]