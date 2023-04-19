import { useState } from 'react'

const Person = ({ person }) => {
  return (
    <p>{person.name}</p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([{ name: 'Janne Kähkönen' }]) 
  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName
    }

    setPersons(persons.concat(personObject))
    setNewName('')
  }

  const handlePersonChanges = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handlePersonChanges}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
        {persons.map(person =>
          <Person key={person.name} person={person} />
        )}
    </div>
  )
}

export default App