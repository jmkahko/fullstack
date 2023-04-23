import { useState, useEffect } from 'react'
import axios from 'axios'
import personServices from './services/personsService'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import personsService from './services/personsService'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [findName, setFindName] = useState('')

  useEffect(() => {
    personServices
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

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
      personsService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
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