// Blocks available for usage

export const EVENTS = {
  ROCKET_LAUNCH: 'ROCKET_LAUNCH'
};

export const BLOCK_NAMES = {
  BRIDGE: 'BUILD_BRIDGE',
  FORWARD: 'FORWARD',
  TAKE_PHOTO: 'TAKE_PHOTO',
  TURN: 'TURN',
  PICK_UP: 'PICK_UP',
  DROP: 'DROP',
  PRESS_BUTTON: 'PRESS_BUTTON',
  REPEAT: 'REPEAT',
  END_REPEAT: 'END REPEAT',
  IF_BUTTON_BLUE: 'IF_BUTTON_BLUE',
  END_IF: 'END_IF',
};

export const BLOCKS = {

  [BLOCK_NAMES.BRIDGE]: {
    name: 'Build Bridge'
  },
  [BLOCK_NAMES.FORWARD]: {
    name: 'Move Forward'
  },
  [BLOCK_NAMES.TURN]: {
    name: 'Turn Around'
  },
  [BLOCK_NAMES.PICK_UP]: {
    name: 'Pick Up Object'
  },
  [BLOCK_NAMES.DROP]: {
    name: 'Drop Object'
  },
  [BLOCK_NAMES.LAUNCH_ROCKET]: {
    name: 'Launch Rocket'
  },
  [BLOCK_NAMES.TAKE_PHOTO]: {
    name: 'Take Photo'
  },
  [BLOCK_NAMES.PRESS_BUTTON]: {
    name: 'Press Button'
  },
  [BLOCK_NAMES.REPEAT]: {
    name: 'Repeat',
    args: [
      {'key': 'count', 'text': 'How many times to repeat?'}
    ]
  },
  [BLOCK_NAMES.END_REPEAT]: {
    name: 'End Repeat'
  },
  [BLOCK_NAMES.IF_BUTTON_BLUE]: {
    name: 'If Button is Blue'
  },
  [BLOCK_NAMES.END_IF]: {
    name: 'End If'
  },
}

export const remaining_blocks = (blocks, program) => {

  // Count up how many times each block is currently used in the program
  const counts = {};
  for (let i = 0; i < program.length; i++) {
    const block = program[i].block;
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

export const instruction_label = ({ block, args }) => {
  const name = BLOCKS[block].name;
  switch (block) {
    case BLOCK_NAMES.REPEAT:
      return `${name} ${args.count}`;

    default:
      return name;
  }
}

// Check if a program is structurally correct
// e.g. ensure all repeat blocks have an 'end repeat'
// This function also adds metadata to block that's useful for execution
// e.g. for 'end' blocks, keep tracks of where the jump back to should be
export const validate_program = (program) => {
  const augmentedProgram = [];
  const stack = [];
  for (let i = 0; i < program.length; i++) {

    // Make a copy of the instruction before mutation
    const instruction = Object.assign({}, program[i]);
    instruction.meta = {id: i};

    let top;
    switch (instruction.block) {

      case BLOCK_NAMES.REPEAT:
        stack.push({type: BLOCK_NAMES.REPEAT, line: i});
        const count = parseInt(instruction.args.count);
        if (isNaN(count)) {
          return {isValid: false, error: 'Tenacity only understands an integer number of times to repeat!'};
        }
        instruction.args.count = count;
        break;

      case BLOCK_NAMES.END_REPEAT:
        top = stack.pop();
        if (top === undefined) {
          return {isValid: false, error: 'Tenacity can only End Repeat after a matching Repeat instruction.'};
        }
        else if (top.type !== BLOCK_NAMES.REPEAT) {
          return {isValid: false, error: 'Tenacity tried to End Repeat, but it looks like some other part of the program needs to be resolved first.'};
        }
        instruction.meta.jumpBackTo = top.line;
        augmentedProgram[top.line].meta.jumpTo = i + 1;
        break;

      case BLOCK_NAMES.IF_BUTTON_BLUE:
        stack.push({type: BLOCK_NAMES.IF_BUTTON_BLUE, condition: true, line: i});
        break;

      case BLOCK_NAMES.END_IF:
        top = stack.pop();
        if (top === undefined) {
          return {isValid: false, error: 'Tenacity can only End If after a matching If instruction.'};
        }
        else if (top.condition !== true) {
          return {isValid: false, error: 'Tenacity tried to End If, but it looks like some other part of the program needs to be resolved first.'};
        }
        augmentedProgram[top.line].meta.jumpTo = i + 1;
        break;

      default:
        break;
    }

    augmentedProgram.push(instruction);
  }

  // Make sure nothing is left on the stack
  const top = stack.pop();
  if (top !== undefined) {
    if (top.type === BLOCK_NAMES.REPEAT) {
      return {isValid: false, error: 'Tenacity found a Repeat instruction, but it needs a matching End Repeat instruction so that it knows when to stop repeating.'};
    }
    else if (top.condition === true) {
      return {isValid: false, error: 'Tenacity found an If instruction, but it needs a matching End If instruction so that it knows when the condition ends.'};
    }
    else {
      // TODO: Shouldn't ever come up, but make this error more descriptive just in case.
      return {isValid: false, error: 'Tenacity found a mistake in the program.'};
    }
  }

  return {isValid: true, augmentedProgram}
}