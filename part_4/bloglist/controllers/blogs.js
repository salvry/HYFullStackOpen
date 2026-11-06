const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const mw = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
 const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
 response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
 const blogs = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
 response.json(blogs)
})

blogsRouter.post('/', mw.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'Not authorized' })
  }
  const blog = new Blog({ title: title, author: author, url: url, likes: likes || 0, user: user._id })
  blog.populate('user', { username: 1 })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', mw.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user
  if (!user || user._id.toString() !== blog.user.toString()) {
    return response.status(401).json({ error: 'Not authorized' })
  }
  await blog.deleteOne()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  const blogToUpdate = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  blogToUpdate.title = title
  blogToUpdate.author = author
  blogToUpdate.url = url
  blogToUpdate.likes = likes
  const updatedBlog = await blogToUpdate.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter