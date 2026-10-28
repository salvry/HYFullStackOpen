import React, { useState, useEffect } from "react";
import personsService from "./services/persons";
import "./styles.css";

const Person = ({ person, deletePerson }) => {
  return (
    <li key={person.id}>
      {person.name} {person.number}{" "}
      <button onClick={deletePerson}>delete</button>
    </li>
  );
};
const FilterPerson = ({ filterName, changeHandler }) => {
  return (
    <div>
      find <input value={filterName} onChange={changeHandler} />
    </div>
  );
};

const AddPerson = ({
  submit,
  newName,
  nameHandler,
  newNumber,
  numberHandler,
}) => {
  return (
    <div>
      <h2>Add a new number</h2>
      <form onSubmit={submit}>
        name <input value={newName} onChange={nameHandler} />
        number <input value={newNumber} onChange={numberHandler} />
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

const SuccessNotification = ({ message }) => {
  if (message === null) {
    return null;
  }
  return (
    <div className="succes-notification">
      <p>{message}</p>
    </div>
  );
};
const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null;
  }
  return (
    <div className="error-notification">
      <p>{message}</p>
    </div>
  );
};
const App = () => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilterName, setFilterName] = useState("");
  const [succesMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    personsService.getPersons().then((persons) => {
      setPersons(persons);
    });
  }, []);

  const personsToShow =
    newFilterName.length === 0
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().startsWith(newFilterName.toLowerCase()),
        );

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterName(event.target.value);
  };

  const addPersonAndNumber = (event) => {
    event.preventDefault();
    if (!newNumber || !newName) {
      alert("Name or number missing");
    } else {
      const newPerson = { name: newName, number: newNumber };
      if (
        persons.find((p) => p.name === newPerson.name && p.number === newNumber)
      ) {
        window.alert(`${newPerson.name} is already on the phonebook`);
        setNewName("");
        setNewNumber("");
      } else if (
        persons.find(
          (p) => p.name === newPerson.name && p.number !== newPerson.number,
        )
      ) {
        const p = persons.find((p) => p.name === newPerson.name);
        const id = p.id;
        replaceNumber(id, newNumber);
      } else {
        if (newPerson.name && newPerson.number) {
          personsService
            .addPerson(newPerson)
            .then((person) => {
              setPersons(persons.concat(person));
              setSuccessMessage(`Added ${newPerson.name}'s phone number`);
              setTimeout(() => {
                setSuccessMessage(null);
              }, 2000);
            })
            .catch((error) => {
              console.log(error);
              setErrorMessage("Error");
              setTimeout(() => {
                setErrorMessage(null);
              }, 2000);
            });

          setNewName("");
          setNewNumber("");
        }
      }
    }
  };

  const deletePersonAndNumber = (id) => {
    const p = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${p.name}?`)) {
      personsService.deletePerson(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
      setSuccessMessage(`Deleted ${p.name}'s phone number`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    }
  };

  const replaceNumber = (id, newNumber) => {
    const person = persons.find((p) => p.id === id);
    if (
      window.confirm(
        `${person.name} is already on the phonebook, do you want to replace their number with a new one?`,
      )
    ) {
      const changedPerson = { ...person, number: newNumber };
      personsService
        .replaceNumber(id, changedPerson)
        .then((changedPerson) =>
          setPersons(persons.map((p) => (p.id !== id ? p : changedPerson))),
        )
        .catch((error) => {
          setErrorMessage(`${person.name} was already deleted`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 2000);
          personsService.getPersons().then((persons) => {
            setPersons(persons);
          });
        });
      setNewName("");
      setNewNumber("");
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <SuccessNotification message={succesMessage} />
      <ErrorNotification message={errorMessage} />
      <AddPerson
        newName={newName}
        newNumber={newNumber}
        nameHandler={handleNameChange}
        numberHandler={handleNumberChange}
        submit={addPersonAndNumber}
      />
      <h2>Numbers</h2>
      <FilterPerson
        filterName={newFilterName}
        changeHandler={handleFilterChange}
      />
      <ul>
        {personsToShow.map((person) => (
          <Person
            person={person}
            deletePerson={() => deletePersonAndNumber(person.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
