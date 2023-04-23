const Person = ({ person, deletePerson }) => {
  return (
    <p>{person.name} {person.number} <button onClick={() => deletePerson(person)}>delete</button></p>
  )
}

const Persons = ({ onClick, persons }) => {
  return (
    <div>
      {persons.map(person =>
        <Person key={person.name} person={person} deletePerson={() => onClick(person)} />
      )}
    </div>
  )
}

export default Persons