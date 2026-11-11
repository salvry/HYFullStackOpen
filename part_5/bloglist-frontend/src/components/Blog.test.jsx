import { render, screen } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  title: 'Example blog',
  author: 'Anonymous',
  url: 'exampleblog.com',
  likes: 0,
  user: { username: 'masa' }
}

const user1 = {
  username: 'masa',
  password: 'password',
  name: 'matti'
}

const user2 = {
  username: 'aatos',
  password: 'password',
  name: 'aatos'
}

const emptyFunc = () => { }

describe('When not logged in', () => {
  test('renders blog', () => {
    render(<Blog blog={blog} handleLikeChange={emptyFunc} handleRemove={emptyFunc} loggedUser={{}} />)
    const blogTitleAndAuthor = screen.getByText('Anonymous: Example blog')
    const blogUrl = screen.getByText('exampleblog.com')
    const blogLikes = screen.getByText('Likes: 0')
    expect(blogTitleAndAuthor).toBeVisible()
    expect(blogUrl).toBeVisible()
    expect(blogLikes).toBeVisible()
  })
  test('does not render like and remove buttons ', () => {
    render(<Blog blog={blog} handleLikeChange={emptyFunc} handleRemove={emptyFunc} loggedUser={{}} />)
  })
})

describe('When logged in', () => {
  test('renders like button', () => {
    render(<Blog blog={blog} handleLikeChange={emptyFunc} handleRemove={emptyFunc} loggedUser={user1} />)
    const likeButton = screen.getByText('Like')
    expect(likeButton).toBeVisible()
  })
  test('renders like button', () => {
    render(<Blog blog={blog} handleLikeChange={emptyFunc} handleRemove={emptyFunc} loggedUser={user1} />)
    const likeButton = screen.getByText('Like')
    expect(likeButton).toBeVisible()
  })
  test('does not render remove button if blog was added by another user', () => {
    render(<Blog blog={blog} handleLikeChange={emptyFunc} handleRemove={emptyFunc} loggedUser={user2} />)
    const removeButton = screen.queryByText('Remove')
    expect(removeButton).not.toBeInTheDocument()
  })
  test('renders remove button if blog was added by logged user', () => {
    render(<Blog blog={blog} handleLikeChange={emptyFunc} handleRemove={emptyFunc} loggedUser={user1} />)
    const removeButton = screen.getByText('Remove')
    expect(removeButton).toBeVisible()
  })
})


