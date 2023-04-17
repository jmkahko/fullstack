import { useState } from 'react'

const DisplayHeader = ({header}) => <h1>{header}</h1>

const Button = ({ handleClick, text}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const StatisticLine = ({ value, text }) => {
  if (text === 'all') {
    return (
      <p>all {value[0] + value[1] + value[2]}</p>
    )
  } else if (text === 'average') {
    let sumYht = value[0] + value[1] + value[2]
    let sum = value[0] - value[2]
    let result = sum / sumYht
  
    if (sumYht === 0) {
      result = 0
    }
    
    return (
      <p>average {result}</p>
    )
  } else if (text === 'positive') {
    let sum = value[0] + value[1] + value[2]
    let result = value[0] / sum * 100

    if (sum === 0) {
      result = 0
    }
  
    return (
      <p>positive {result} %</p>
    )
  } else {
    return (
      <p>{text} {value}</p>
    )
  }
}

const Statistics = (props) => {
  const good = props.props[0]
  const neutral = props.props[1]
  const bad = props.props[2]

  if (good > 0 || neutral > 0 || bad > 0) {
    return (
      <div>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={[good, neutral, bad]} />
        <StatisticLine text="average" value={[good, neutral, bad]} />
        <StatisticLine text="positive" value={[good, neutral, bad]} />
      </div>
    )
  } else {
    return (
      <p>No feedback given</p>
    )
  }
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <div>
        <DisplayHeader header="give feedback" />
        <Button handleClick={() => setGood(good + 1)} text="good" />
        <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
        <Button handleClick={() => setBad(bad + 1)} text="bad" />
      </div>
      <div>
        <DisplayHeader header="statistics" />
        <Statistics props={[good, neutral, bad]} />
      </div>
    </div>
  )
}

export default App