import { useState } from 'react'

const DisplayHeader = ({header}) => <h1>{header}</h1>

const Button = ({ handleClick, text}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const All = (props) => {
  return (
    <p>all {props.props[0] + props.props[1] + props.props[2]}</p>
  )
}

const Average = (props) => {
  let sumYht = props.props[0] + props.props[1] + props.props[2]
  let sum = props.props[0] - props.props[2]
  let result = sum / sumYht

  if (sumYht === 0) {
    result = 0
  }

  return (
    <p>average {result}</p>
  )
}

const Positive = (props) => {
  let sum = props.props[0] + props.props[1] + props.props[2]
  let result = props.props[0] / sum * 100
  if (sum === 0) {
    result = 0
  }

  return (
    <p>positive {result} %</p>
  )
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
        <p>good {good}</p>
        <p>neutral {neutral}</p>
        <p>bad {bad}</p>
        <All props={[good, neutral, bad]} />
        <Average props={[good, neutral, bad]} />
        <Positive props={[good, neutral, bad]} />
      </div>
    </div>
  )
}

export default App