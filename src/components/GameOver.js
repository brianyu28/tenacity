import rover from '../assets/rover.svg';

const GameOver = () => {
  return (<div style={{ maxWidth: '500px' }}>
    <img src={rover} alt='Tenacity' style={{ width: 150 }} />
    <h1>Congratulations!</h1>
    <div>
      You've successfully navigated the Tenacity rover
      to successfully completion of all of its missions.
      Thank you for playing!
    </div>
    <br/>
    <h2>About Tenacity</h2>
    <div>
      I'm Brian Yu, and I developed Tenacity as part of a project at
      Harvard's Graduate School of Education.
      I would love to hear your thoughts and feedback on the experience: you can reach me
      at <a style={{color: 'white'}} href="mailto:brian@brianyu.me">brian@brianyu.me</a>.
    </div>
  </div>);
}

export default GameOver;