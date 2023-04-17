import { useState } from 'react'

const DisplayHeader = ({header}) => <h1>{header}</h1>

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const randomNumber = (value) => {
  return Math.floor(Math.random() * value.length)
}

const arrayVote = (arrayList, selected) => {
  const copyList = { ...arrayList }
  copyList[selected] += 1
  return copyList
}

const arrayMax = (arrayList, listLenght) => {
  let major = 0

  for (let i = 0; i < listLenght; i++) {
    if (arrayList[i] > major) {
      major = arrayList[i]
    }
  }
  return major
}

const arrayMaxAnec = (arrayList, listLenght) => {
  let major = 0
  let majorAnec = 0

  for (let i = 0; i < listLenght; i++) {
    if (arrayList[i] > major) {
      major = arrayList[i]
      majorAnec = i
    }
  }
  return majorAnec
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [arrayList, setVote] = useState(new Uint8Array(anecdotes.length))

  return (
    <div>
      <DisplayHeader header="Anecdote of the day" />
      {anecdotes[selected]}
      <p>has {arrayList[selected]} votes</p>
      <div>
        <Button handleClick={() => setVote(arrayVote(arrayList, selected))} text="vote" />
        <Button handleClick={() => setSelected(randomNumber(anecdotes))} text="next anecdote" />
      </div>

      <DisplayHeader header="Anecdote with most votes" />
      {anecdotes[arrayMaxAnec(arrayList, anecdotes.length)]}
      <p>has {arrayMax(arrayList, anecdotes.length)} votes</p>
    </div>

  )
}

export default App