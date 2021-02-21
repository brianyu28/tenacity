export default ({ briefing, onCompleteBriefing }) => {
  return (
    <div style={{ fontSize: '24px', textAlign: 'center' }}>
      {briefing}
      <br/>
      <button onClick={onCompleteBriefing}>Continue</button>
    </div>
  );
}