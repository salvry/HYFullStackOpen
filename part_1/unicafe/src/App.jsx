import { useState } from "react";

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};
const Statistics = ({ good, bad, neutral }) => {
  const all = good + neutral + bad;
  const avg = (good + bad * -1) / all;
  const positive = (good / all) * 100;
  return (
    <div>
      <h2>Statistics</h2>
      {all > 0 ? (
        <table>
          <tbody>
            <StatisticLine text={"Good"} value={good} />
            <StatisticLine text="Neutral" value={neutral} />
            <StatisticLine text="Bad" value={bad} />
            <StatisticLine text="All" value={all} />
            <StatisticLine text="Average" value={avg} />
            <StatisticLine text="Positive" value={`${positive}%`} />
          </tbody>
        </table>
      ) : (
        <p>No feedback</p>
      )}
    </div>
  );
};

const Button = ({ clickHandler, text }) => {
  return <button onClick={clickHandler}>{text}</button>;
};
const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>Unicafe</h1>
      <h2>Give feedback</h2>
      <Button clickHandler={() => setGood(good + 1)} text="Good" />
      <Button clickHandler={() => setNeutral(neutral + 1)} text="Neutral" />
      <Button clickHandler={() => setBad(bad + 1)} text="Bad" />
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  );
};

export default App;
