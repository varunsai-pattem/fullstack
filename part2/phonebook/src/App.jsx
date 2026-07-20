import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [notification, setNotification] = useState({
    message: null,
    type: null
  })

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.error('Failed to fetch contacts:', error)
      })
  }, [])

  const showNotification = (message, type) => {
    setNotification({ message, type })

    setTimeout(() => {
      setNotification({
        message: null,
        type: null
      })
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const trimmedName = newName.trim()
    const trimmedNumber = newNumber.trim()

    if (!trimmedName || !trimmedNumber) {
      showNotification('Please enter both name and phone number', 'error')
      return
    }

    const existingPerson = persons.find(
      person =>
        person.name.toLowerCase() === trimmedName.toLowerCase()
    )

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${trimmedName} is already added to the phonebook, replace the old number with a new one?`
      )

      if (!confirmUpdate) {
        return
      }

      const updatedPerson = {
        ...existingPerson,
        number: trimmedNumber
      }

      personsService
        .update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(
            persons.map(person =>
              person.id !== existingPerson.id
                ? person
                : returnedPerson
            )
          )

          setNewName('')
          setNewNumber('')

          showNotification(
            `Changed number for ${returnedPerson.name}`,
            'success'
          )
        })
        .catch(error => {
          showNotification(
            `Information of ${existingPerson.name} has already been removed from server`,
            'error'
          )

          setPersons(
            persons.filter(
              person => person.id !== existingPerson.id
            )
          )

          console.error(error)
        })

      return
    }

    const personObject = {
      name: trimmedName,
      number: trimmedNumber
    }

    personsService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))

        setNewName('')
        setNewNumber('')

        showNotification(
          `Added ${returnedPerson.name}`,
          'success'
        )
      })
      .catch(error => {
        showNotification(
          'Failed to add the contact',
          'error'
        )

        console.error(error)
      })
  }

  const handleRemovePerson = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name}?`)

    if (!confirmDelete) {
      return
    }

    personsService
      .remove(id)
      .then(() => {
        setPersons(
          persons.filter(person => person.id !== id)
        )

        showNotification(`Deleted ${name}`, 'success')
      })
      .catch(error => {
        showNotification(
          `Information of ${name} has already been removed from server`,
          'error'
        )

        setPersons(
          persons.filter(person => person.id !== id)
        )

        console.error(error)
      })
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

  const personsToShow =
    filterQuery === ''
      ? persons
      : persons.filter(person =>
          person.name
            .toLowerCase()
            .includes(filterQuery.toLowerCase())
        )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification notification={notification} />

      <Filter
        value={filterQuery}
        onChange={handleFilterChange}
      />

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons
        persons={personsToShow}
        onDelete={handleRemovePerson}
      />
    </div>
  )
}

export default App