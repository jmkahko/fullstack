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
  const [informationMessage, setInformationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
          .then(() => {
            setInformationMessage(`Person '${newName}' number is update`)
            setTimeout(() => {
              setInformationMessage(null)
            }, 2000)
          })
          .catch(() => {
            setErrorMessage(`the person '${newName}' operation failed`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 2000)
          })

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
          setInformationMessage(`Person '${personObject.name}' added`)
          setTimeout(() => {
            setInformationMessage(null)
          }, 2000)
        })
        .catch(() => {
          setErrorMessage(`the person '${personObject.name}' operation failed`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 2000)
        })
    }
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personsService
        .deletePerson(person.id)
        .then(() => {
          setInformationMessage(`Person '${person.name}' deleted`)
          setTimeout(() => {
            setInformationMessage(null)
          }, 2000)
        })
        .catch(() => {
          setErrorMessage(`the person '${person.name}' operation failed`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 2000)
        })

      personsService
        .getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
        })
    }
  }

  const InformationNotification = ({ message }) => {
    if (message === null) {
      return null
    }

    return (
      <div className='information'>
        {message}
      </div>
    )
  }

  const ErrorNotification = ({ message }) => {
    if (message === null) {
      return null
    }

    return (
      <div className='error'>
        {message}
      </div>
    )
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
      <InformationNotification message={informationMessage} />
      <ErrorNotification message={errorMessage} />

      <Filter value={findName} onChange={handleFindNameChanges} />

      <h3>Add a new</h3>
      <PersonForm onSubmit={addPerson} value={[newName, newNumber]} onChange={[handlePersonChanges, handleNumberChanges]} />

      <h3>Numbers</h3>
      <Persons onClick={deletePerson} persons={personShow} />
    </div>
  )
}

export default App