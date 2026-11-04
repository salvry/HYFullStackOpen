const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

 const blogs = [
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
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes of blogs', () => {
  test('zero when empty list', () => {
    const emptyList = []
    const result = listHelper.totalLikes(emptyList)
    assert.strictEqual(result, 0)
  })

  test('when only one blog, equals the likes of that', () => {
    const listWithOneBlog = [blogs[0]]
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 7)
  })

  test('the sum of all blog likes', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
})

  describe('favorite blog', () => {
    test('null when empty list', () => {
      const emptyList = []
      const result = listHelper.favoriteBlog(emptyList)
      assert.deepStrictEqual(result, null)
    })

    test('when only one blog, returns that', () => {
      const listWithOneBlog = [blogs[0]]
      const result = listHelper.favoriteBlog(listWithOneBlog)
      assert.deepStrictEqual(result, blogs[0])
    })

    test('the blog with the most likes', () => {
      const result = listHelper.favoriteBlog(blogs)
      assert.deepStrictEqual(result, blogs[2])
    })
})

describe('the most productive author', () => {
    test('null when empty list', () => {
      const emptyList = []
      const result = listHelper.mostBlogs(emptyList)
      assert.strictEqual(result, null)
    })

    test('when only one blog, returns the author of that', () => {
      const listWithOneBlog = [blogs[0]]
      const result = listHelper.mostBlogs(listWithOneBlog)
      assert.deepStrictEqual(result, {author: blogs[0].author, blogs: 1})
    })

    test('the author with the most blogs', () => {
      const result = listHelper.mostBlogs(blogs)
      assert.deepStrictEqual(result, {author: "Robert C. Martin", blogs: 3})
    })
})

describe('the most popular author', () => {
    test('null when empty list', () => {
      const emptyList = []
      const result = listHelper.mostLikes(emptyList)
      assert.strictEqual(result, null)
    })

    test('when only one blog, returns the author and likes of that', () => {
      const listWithOneBlog = [blogs[0]]
      const result = listHelper.mostLikes(listWithOneBlog)
      assert.deepStrictEqual(result, {author: blogs[0].author, likes: 7})
    })

    test('the author with the most likes', () => {
      const result = listHelper.mostLikes(blogs)
      assert.deepStrictEqual(result, {author: 'Edsger W. Dijkstra', likes: 17})
    })
})