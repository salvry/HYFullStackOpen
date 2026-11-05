const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')
const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  for(const user of helper.initialUsers){
    const passwordHash = await bcrypt.hash(user.password, 10)
    const newUser = new User({username: user.username, passwordHash: passwordHash, name: user.name})
    await newUser.save()
  }
})
  
describe('returning users', () => {
    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('returns initial users', async () => {
        const users = await helper.usersInDb()
        assert.strictEqual(users.length, helper.initialUsers.length)
    })
})

describe('adding users', () => {
    test('adding a valid user succeeds', async () => {
        const user = { username: "tepi", password: "salasana", name: "Tellervo" }
        await api
            .post('/api/users')
            .send(user)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const users = await helper.usersInDb()
        const userNames = users.map(user => user.username)
        assert.strictEqual(users.length, helper.initialUsers.length + 1)
        assert(userNames.includes("tepi"))
    })

    test('does not add a user if password is too short', async () => {
        const user = { username: "tepi", password: "12", name: "Tellervo" }
        const result = await api
            .post('/api/users')
            .send(user)
            .expect(400)
        console.log(result.body.error)
        assert(result.body.error.includes('password too short'))
        const users = await helper.usersInDb()
        const userNames = users.map(user => user.username)
        assert.strictEqual(users.length, helper.initialUsers.length)
        assert(!userNames.includes("tepi"))
    })
    
      test('does not add a user if username is too short', async () => {
        const user = { username: "te", password: "password", name: "Tellervo" }
        const result = await api
            .post('/api/users')
            .send(user)
            .expect(400)
        assert(result.body.error.includes(`\`username\` (\`${user.username}\`) is shorter than the minimum allowed length`))
        const users = await helper.usersInDb()
        const userNames = users.map(user => user.username)
        assert.strictEqual(users.length, helper.initialUsers.length)
        assert(!userNames.includes("te"))
    })

    test('does not add a user without username', async () => {
        const user = { password: "password", name: "Pekka" }
        const result = await api
            .post('/api/users')
            .send(user)
            .expect(400)
        assert(result.body.error.includes('username is required'))
        const users = await helper.usersInDb()
        assert.strictEqual(users.length, helper.initialUsers.length)
    })

    test('does not add a user without password', async () => {
        const user = { username: "petsku", name: "Pekka" }
        const result = await api
            .post('/api/users')
            .send(user)
            .expect(400)
        assert(result.body.error.includes('password is required'))
        const users = await helper.usersInDb()
        assert.strictEqual(users.length, helper.initialUsers.length)
    })
    test('does not add a user if username is already taken', async () => {
        const user = { username: "masa", password: "salasana", name: "Matias" }
        const result = await api
            .post('/api/users')
            .send(user)
            .expect(400)
        assert(result.body.error.includes('expected `username` to be unique'))
        const users = await helper.usersInDb()
        assert.strictEqual(users.length, helper.initialUsers.length)
    })
})

 test('user can log in and token is returned', async () => {
        const user = helper.initialUsers[0]
        const response = await api
            .post('/api/login')
            .send({username: user.username, password: user.password})
            .expect(200)
        const username = response.body.username
        const loggedUser = await User.findOne({ username })
        const userForToken = {
            username: loggedUser.username,
            id: loggedUser._id
        }
        const token = jwt.sign(userForToken, process.env.SECRET)
        
        assert.strictEqual(user.username, loggedUser.username)
        assert.strictEqual(token, response.body.token)
    })

after(async () => {
  await mongoose.connection.close()
})