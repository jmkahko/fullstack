import { useState } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'

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
      <Filter value={findName} onChange={handleFindNameChanges} />

      <h3>Add a new</h3>
      <PersonForm onSubmit={addPerson} value={[newName, newNumber]} onChange={[handlePersonChanges, handleNumberChanges]} />

      <h3>Numbers</h3>
      <Persons persons={personShow} />
    </div>
  )
}

export default App