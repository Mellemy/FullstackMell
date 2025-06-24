import { useState } from 'react'


const Button= ({ use, text }) => {
  return (
<button onClick={use}>{text}</button>
  )
}
const StatisticLine = ({ text, value }) => (
<tr><td>{text}</td><td>{value}</td></tr>
)

const Statistics = ({good, neutral, bad, allClicks}) => {
  
  const average = allClicks === 0 ? 0 : (good - bad) / allClicks
  const positive = allClicks === 0 ? 0 : (good / allClicks) * 100

if (allClicks === 0) {
  return (  <div>  <h2>statistics</h2>
  <p>No feedback given</p> </div>  )
}
return (
<div>
    <h2>statistics</h2>
  <table>
      <tbody>
      <StatisticLine text="Good" value={good} />
      <StatisticLine text="Neutral" value={neutral} />
      <StatisticLine text="Bad" value={bad} />
      <StatisticLine text="All" value={allClicks} />
      <StatisticLine text="Average" value={average} />
      <StatisticLine text="Positive" value={`${positive}%`} />
     </tbody>
    </table>
   </div>
) 
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allClicks, setAll] = useState(0)

   const handleGood = () => {
    setAll(allClicks + 1)
    setGood(good + 1)
  }

  const handleNeutral = () => {
  setAll(allClicks + 1)
    setNeutral(neutral + 1)
  }

  const handleBad = () => {
    setAll(allClicks + 1)
    setBad(bad + 1)
  }

  return (
    <div>
      <div>
        <h1>Give feedback</h1>
        <Button use={handleGood} text = "good" />
        <Button use={handleNeutral} text = "neutral" />
        <Button use={handleBad} text ="bad" />
    
        <Statistics good={good} neutral={neutral} bad={bad} allClicks={allClicks} />
      </div>
    </div>
  )
}

export default App