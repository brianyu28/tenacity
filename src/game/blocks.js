// Blocks available for usage

export const BLOCK_NAMES = {
  FORWARD: 'FORWARD'
}

export const BLOCKS = {

  [BLOCK_NAMES.FORWARD]: {
    name: 'Move Forward'
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