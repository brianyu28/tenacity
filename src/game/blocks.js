// Blocks available for usage

export const EVENTS = {
  ROCKET_LAUNCH: 'ROCKET_LAUNCH'
};

export const BLOCK_NAMES = {
  FORWARD: 'FORWARD',
  TURN: 'TURN',
  PICK_UP: 'PICK_UP'
};

export const BLOCKS = {

  [BLOCK_NAMES.FORWARD]: {
    name: 'Move Forward'
  },
  [BLOCK_NAMES.TURN]: {
    name: 'Turn Around'
  },
  [BLOCK_NAMES.PICK_UP]: {
    name: 'Pick Up Object'
  },
  [BLOCK_NAMES.LAUNCH_ROCKET]: {
    name: 'Launch Rocket'
  }
}

export const remaining_blocks = (blocks, program) => {

  // Count up how many times each block is currently used in the program
  const counts = {};
  for (let i = 0; i < program.length; i++) {
    const block = program[i];
    if (counts[block] === undefined) {
      counts[block] = 1;
    } else {
      counts[block]++;
    }
  }

  // Remove
  return blocks.reduce((acc, [block, count]) => (
    [...acc, [block, count - (counts[block] || 0)]]
  ), []);
}