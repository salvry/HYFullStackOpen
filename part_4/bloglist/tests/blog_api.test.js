const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
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
    const newBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
  }
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length+1)
    const latestBlog = blogs[blogs.length-1]
    assert.strictEqual(latestBlog.title, newBlog.title)
  })

  test('likes are set to zero if undefined ', async () => {
    const newBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll"
  }

    const response = await api
    .post('/api/blogs')
    .send(newBlog)
    assert.strictEqual(response.body.likes, 0)
  })

   test('response 400 if title or url is not set', async () => {
    const blogWithoutTitle = {
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    }
    await api
    .post('/api/blogs')
    .send(blogWithoutTitle)
    .expect(400)

    const blogWithoutUrl = {
        title: "First class tests",
        author: "Robert C. Martin",
    }
    await api
    .post('/api/blogs')
    .send(blogWithoutUrl)
    .expect(400)
    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length)
  })
})
describe('deleting and updating blogs', () => {
    test('blog can be deleted by id', async () => {
        const blogsBeforeDeletion = await helper.blogsInDb()
        const blogToDelete = blogsBeforeDeletion[0]
        await api
        .delete(`/api/blogs/${blogToDelete.id}`)
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