import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import personsService from './services/PersonsService'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [findName, setFindName] = useState('')

  useEffect(() => {
    personsService
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
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatePerson = {...booleanName, number: newNumber}

        personsService
          .update(booleanName.id, updatePerson)

        personsService
          .getAll()
          .then(initialPersons => {
            setPersons(initialPersons)
            setNewName('')
            setNewNumber('')
          })
      }
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

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personsService
        .deletePerson(person.id)
        
      personsService
        .getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
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
      <Persons onClick={deletePerson} persons={personShow} />
    </div>
  )
}

export default App