const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
 const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
 response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body
   if (!password) {
        response.status(400).send({ error: 'password is required' })
    }
    if (!username) {
        response.status(400).send({ error: 'username is required' })
    }
    if(password.length < 3){
        response.status(400).json({ error: 'password too short' })
    }
    else{
        const passwordHash = await bcrypt.hash(password, 10)
        const savedUser = await new User({username, passwordHash, name}).save()
        response.status(201).json(savedUser)
    }
})

module.exports = usersRouter