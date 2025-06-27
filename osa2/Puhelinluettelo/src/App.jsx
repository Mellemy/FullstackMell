//Osan3 muutokset tehty ennen Osan2 palautusta
import { useState, useEffect } from 'react'
import Filter from './Components/Filter'
import PeopleList from './Components/PeopleList'
import NewPerson from './Components/NewPerson'
import noteService from './Services/persons'
import Notification from './Components/Notification'

import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })

   useEffect(() => {
    console.log('effect')
      noteService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

   const addPerson = (event) => {
    event.preventDefault()

      const newPerson = {
      name: newName,
      number: newNumber
    }

   const duplicate = persons.find(p => p.name === newName)

  if (duplicate) {
    const updatedPerson = { ...duplicate, number: newNumber }
    noteService
      .update(duplicate.id, updatedPerson)
          .then(response => {
        setPersons(persons.map(p => p.id !== duplicate.id ? p : response.data))
        setNewName('')
        setNewNumber('')
        setNotification({ message: `Updated ${newName}`, type: 'success' })
        setTimeout(() => setNotification({ message: null, type: null }), 4000)
      })
      .catch(error => {
        setNotification({ message: `Failed to update ${newName}`, type: 'error' })
        setTimeout(() => setNotification({ message: null, type: null }), 4000)
      })
  } else {
    noteService
      .create(newPerson)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        setNotification({ message: `Added ${newName}`, type: 'success' })
        setTimeout(() => setNotification({ message: null, type: null }), 4000)
      })
   .catch(error => {
  console.log('Full error response:', error.response)

  const errorMsg = error.response?.data?.error || 'Failed to add person'
  setNotification({ message: errorMsg, type: 'error' })
  setTimeout(() => setNotification({ message: null, type: null }), 4000)
})
  }

  }
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }
  const handleDelete = (id, name) => {
  const confirm = window.confirm(`Delete ${name}?`)
  if (!confirm) return

  noteService
    .erase(id)
      .then(() => {
      setPersons(persons.filter(p => p.id !== id))
      setNotification({ message: `Deleted ${name}`, type: 'success' })
      setTimeout(() => setNotification({ message: null, type: null }), 4000)
    })
    .catch(error => {
      setNotification({
        message: `Information of ${name} has already been removed from server`,
        type: 'error'
      })
      setTimeout(() => setNotification({ message: null, type: null }), 4000)
    })
  }

   const filteredPeople = filter === ''
    ? persons
    : persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
    )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
        <Filter value={filter} onChange={handleFilterChange} />

      <h2>Add contact</h2>
         <NewPerson
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange} />

       <h2>Numbers</h2>
      <PeopleList persons={filteredPeople} onDelete={handleDelete}/>
    </div>
  )
}

export default App