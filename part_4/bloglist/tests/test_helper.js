const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initialUsers = [
  {
    username: "masa",
    password: "masansalasana",
    name: "Matti"
  },
  {
    username: "aatos",
    password: "aatoksensalasana",
    name: "Aatos"
  }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  }
]
const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const login = async () => {
    const user = initialUsers[0]
    const response = await api.post('/api/login').send({username: user.username, password: user.password})
    return response.body
}
module.exports = {
  initialBlogs, blogsInDb, initialUsers, usersInDb, login
}