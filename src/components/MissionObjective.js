const MissionObjective = ({ missionNumber, objective }) => {
  return (
    <div style={{ fontSize: '24px', textAlign: 'center' }}>
      <strong>Mission {missionNumber} Objective</strong>
      <br/>
      {objective}
    </div>
  );
}

export default MissionObjective;