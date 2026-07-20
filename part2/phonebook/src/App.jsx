import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  // Pre-populate with dummy data to test your search/filtering on launch
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterQuery, setFilterQuery] = useState('')

  const addPerson = (event) => {
    event.preventDefault()

    // 2.7 check: Prevent duplicate name additions (case-insensitive)
    const nameExists = persons.some(
      (person) => person.name.toLowerCase() === newName.trim().toLowerCase()
    )

    if (nameExists) {
      alert(`${newName.trim()} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName.trim(),
      number: newNumber.trim(),
      id: persons.length + 1 // Temporary numeric ID generation
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterQuery(event.target.value)
  }

  // 2.9* check: Render matching contacts based on the case-insensitive filter
  const personsToShow = filterQuery === ''
   ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(filterQuery.toLowerCase())
      )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filterQuery} onChange={handleFilterChange} />
      
      <h3>Add a new</h3>
      <PersonForm 
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App