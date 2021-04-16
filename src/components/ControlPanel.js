import { BLOCKS, instruction_label, validate_program } from '../game/blocks';

const ControlPanel = ({ addToProgram, blocks, onResetProgram, onSubmitProgram,
                  program, programSubmitted }) => {

  function blockClicked(blockId) {
    if (!programSubmitted) {

      const block = BLOCKS[blockId];

      // Check for block arguments to add
      const args = {};
      if (block.args !== undefined) {
        for (const arg of block.args) {
          args[arg.key] = window.prompt(arg.text);
        }
      }
      addToProgram(blockId, args);
    }
  }

  function submitProgram() {

    const { isValid, augmentedProgram, error } = validate_program(program);

    // Don't allow submission of an invalid program
    if (!isValid) {
      alert(error);
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setTimeout(() => {
      onSubmitProgram(augmentedProgram);
    }, 1000);
  }

  return (
    <div id='control-panel'>
      <div id='control-panel-container'>
        <div>
          <div id='program'>
            {program.map((instruction, i) => {
              return <div key={i}>
                {instruction_label(instruction)}
              </div>
            })}
          </div>
          {!programSubmitted &&
          <div>
            <button onClick={onResetProgram}>Reset</button>
            <button onClick={submitProgram}>Submit Instructions</button>
          </div>
          }
        </div>
        <div id='blocks'>
          {blocks.map(([block, count], i) => {
            if (count === 0)
              return false;
            return <button
              className='block'
              key={i}
              onClick={() => blockClicked(block)}
            >
              {BLOCKS[block].name} (x{count})
            </button>
          })}
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;