export default ({ addToProgram, blocks, onResetProgram, program }) => {
  return (
    <div id='control-panel'>
      <div id='control-panel-container'>
        <div>
          <div id='program'>
            {program.map((instruction, i) => {
              return <div key={i}>
                {instruction}
              </div>
            })}
          </div>
          <button onClick={onResetProgram}>Reset</button>
          <button>Submit Instructions</button>
        </div>
        <div id='blocks'>
          {blocks.map(([block, count], i) => {
            if (count == 0)
              return;
            return <button
              className='block'
              key={i}
              onClick={() => addToProgram(block.name)}
            >
              {block.name} (x{count})
            </button>
          })}
        </div>
      </div>
    </div>
  );
}