import { useState } from 'react'

const Person = ({ person }) => {
  return (
    <p>{person.name} {person.number}</p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Janne Kähkönen', number: '050-1234567' },
    { name: 'Aku Ankka', number: '050-313' },
    { name: 'Roope-Setä', number: '050-3131' },
    { name: 'Tupu', number: '050-3132' },
    { name: 'Hupu', number: '050-3133' },
    { name: 'Lupu', number: '050-3134' },
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [findName, setFindName] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    const booleanName = persons.find(({ name }) => name === newName)

    if (booleanName !== undefined && booleanName.name === newName) {
      window.alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
  }

  const personShow = persons.filter(person => person.name.toUpperCase().includes(findName.toUpperCase()))

  const handlePersonChanges = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChanges = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFindNameChanges = (event) => {
    setFindName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input value={findName} onChange={handleFindNameChanges}/>
      </div>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handlePersonChanges}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChanges}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
        {personShow.map(person =>
          <Person key={person.name} person={person} />
        )}
    </div>
  )
}

export default App