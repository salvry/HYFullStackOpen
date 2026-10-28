const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
morgan.token("data", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data"),
);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: "1",
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "2",
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "3",
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "4",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const info =
    persons.length === 1
      ? `Phonebook has info for ${persons.length} person`
      : `Phonebook has info for ${persons.length} people`;
  response.end(`<p>${info}</p><p>${new Date()}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
  const person = persons.find((person) => person.id === request.params.id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const personToDelete = persons.find(
    (person) => person.id === Number(request.params.id),
  );
  if (personToDelete) {
    persons = persons.filter(
      (person) => person.id !== Number(request.params.id),
    );
    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: "Name or number missing",
    });
  }
  const newPerson = {
    name: request.body.name,
    number: request.body.number,
  };
  if (persons.some((person) => person.name === newPerson.name)) {
    return response.status(400).json({
      error: "Name must be unique",
    });
  }
  newPerson.id =
    Math.floor(Math.random() * (101 - persons.length + 1)) + persons.length + 1;
  persons = persons.concat(newPerson);
  response.json(newPerson);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
