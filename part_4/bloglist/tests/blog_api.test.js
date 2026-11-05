const assert = require('node:assert')
const bcrypt = require('bcrypt')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  const user = helper.initialUsers[0]
  const passwordHash = await bcrypt.hash(user.password, 10)
  const newUser = new User({username: user.username, passwordHash: passwordHash, name: user.name})
  await newUser.save()
  for(const blog of helper.initialBlogs){
    const blogToSave = new Blog(blog)
    blogToSave.user = newUser.id
    await blogToSave.save()
  }
})

describe('returning blogs', () => {
  test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs have an id', async () => {
     const response = await api.get('/api/blogs')
     assert(response.body.every(blog => blog.id !== undefined))
     assert(response.body.every(blog => blog._id === undefined))
    })
})

describe('adding blogs', () => {
  test('valid blog is added', async () => {
    const loggedUser = await helper.login()
    const newBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
  }
    await api
    .post('/api/blogs')
    .set({authorization: `Bearer ${loggedUser.token}`})
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length+1)
    const latestBlog = blogs[blogs.length-1]
    assert.strictEqual(latestBlog.title, newBlog.title)
  })

  test('blog is not added without token', async () => {
    const newBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
  }
    const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length)
    assert(response.body.error.includes('missing or invalid token'))
  })

  test('likes are set to zero if undefined ', async () => {
    const loggedUser = await helper.login()
    const newBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll"
  }

    const response = await api
    .post('/api/blogs')
    .set({authorization: `Bearer ${loggedUser.token}`})
    .send(newBlog)
    assert.strictEqual(response.body.likes, 0)
  })

   test('response 400 if title or url is not set', async () => {
    const loggedUser = await helper.login()
   
    const blogWithoutTitle = {
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10
    }
    const response = await api
    .post('/api/blogs')
    .set({authorization: `Bearer ${loggedUser.token}`})
    .send(blogWithoutTitle)
    
    assert(response.body.error.includes('`title` is required'))

    const blogWithoutUrl = {
        title: "First class tests",
        author: "Robert C. Martin",
        likes: 10
    }
    const response2 = await api
    .post('/api/blogs')
    .set({authorization: `Bearer ${loggedUser.token}`})
    .send(blogWithoutUrl)
    .expect(400)
     assert(response2.body.error.includes('`url` is required'))
    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length)
  })
})
describe('deleting and updating blogs', () => {
    test('blog can be deleted by id', async () => {
        const loggedUser = await helper.login()
        const blogsBeforeDeletion = await helper.blogsInDb()
        const blogToDelete = blogsBeforeDeletion[0]
        await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({authorization: `Bearer ${loggedUser.token}`})
        .expect(204)

        const blogsAfterDeletion = await helper.blogsInDb()
        assert.strictEqual(blogsAfterDeletion.length, helper.initialBlogs.length-1)
        const blogIds = blogsAfterDeletion.map(blog => blog.id)
        assert(!blogIds.includes(blogToDelete.id))
    })
    test('blog likes can be updated', async () => {
        const blogsBeforeUpdate = await helper.blogsInDb()
        const blogToUpdate = blogsBeforeUpdate[0]
        blogToUpdate.likes += 1
        await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)

        const blogsAfterUpdate = await helper.blogsInDb()
        const updatedBlog = blogsAfterUpdate[0]
        assert.strictEqual(updatedBlog.likes, helper.initialBlogs[0].likes+1)
    })
  })

after(async () => {
  await mongoose.connection.close()
})