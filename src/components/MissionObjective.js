const MissionObjective = ({ missionNumber, objective, hint }) => {
  return (
    <div style={{ fontSize: '24px', textAlign: 'center' }}>
      <strong>Mission {missionNumber} Objective</strong>
      <br/>
      {objective}
      {
        hint &&
        <div style={{ fontSize: '18px', textAlign: 'center' }}>
          <hr/>
          {hint}
          <br/>
        </div>
      }
    </div>
  );
}

export default MissionObjective;