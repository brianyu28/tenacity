import { BLOCKS } from '../game/blocks';

export default ({ addToProgram, blocks, onResetProgram, onSubmitProgram,
                  program, programSubmitted }) => {
  return (
    <div id='control-panel'>
      <div id='control-panel-container'>
        <div>
          <div id='program'>
            {program.map((instruction, i) => {
              return <div key={i}>
                {BLOCKS[instruction].name}
              </div>
            })}
          </div>
          {!programSubmitted &&
          <div>
            <button onClick={onResetProgram}>Reset</button>
            <button onClick={onSubmitProgram}>Submit Instructions</button>
          </div>
          }
        </div>
        <div id='blocks'>
          {blocks.map(([block, count], i) => {
            if (count == 0)
              return;
            return <button
              className='block'
              key={i}
              onClick={() => addToProgram(block)}
            >
              {BLOCKS[block].name} (x{count})
            </button>
          })}
        </div>
      </div>
    </div>
  );
}