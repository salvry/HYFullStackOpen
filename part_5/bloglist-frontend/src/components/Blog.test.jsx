import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

const blog = {
  title: 'Example blog',
  author: 'Anonymous',
  url: 'exampleblog.com',
  likes: 0,
  user: { username: 'example user' }
}

const emptyFunc = () => { }

test('renders blog', () => {

  render(<Blog blog={blog} handleLikeChange={emptyFunc} handleRemove={emptyFunc} loggedUser={{}} />)

  const blogTitleAndAuthor = screen.getByText('Anonymous: Example blog')

  expect(blogTitleAndAuthor).toBeVisible()
})

test('shows blog details on button click', async () => {
  render(<Blog blog={blog} handleLikeChange={emptyFunc} handleRemove={emptyFunc} loggedUser={{}} />)
  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  let blogAdder = screen.queryByText('Blog added by: example user')
  let url = screen.queryByText('exampleblog.com')
  let likes = screen.queryByText('Likes: 0')
  expect(likes).not.toBeInTheDocument()
  await user.click(viewButton)
  const hideButton = screen.getByText('hide')
  const likeButton = screen.getByText('like')
  blogAdder = screen.queryByText('Blog added by: example user')
  url = screen.queryByText('exampleblog.com')
  likes = screen.queryByText('Likes: 0')
  expect(url).toBeVisible()
  expect(likes).toBeVisible()
  expect(hideButton).toBeVisible()
  expect(likeButton).toBeVisible()
  expect(blogAdder).toBeVisible()
})

test('event handler is called twice when button is clicked twice', async () => {
  const likeHandler = vi.fn()
  render(<Blog blog={blog} handleLikeChange={likeHandler} handleRemove={emptyFunc} loggedUser={{}} />)
  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(likeHandler.mock.calls).toHaveLength(2)
})

test('blog form submit', async () => {
    const createBlog = vi.fn()
    const { container } = render(<BlogForm createBlog={createBlog} />)
    const title = container.querySelector('#title')
    const author = container.querySelector('#author')
    const url = container.querySelector('#url')
    await userEvent.type(title, 'Blog title')
    await userEvent.type(author, 'Author')
    await userEvent.type(url, 'Blog url')
    const submitButton = screen.getByText('Add')
    await userEvent.click(submitButton)
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Blog title')
    expect(createBlog.mock.calls[0][0].author).toBe('Author')
    expect(createBlog.mock.calls[0][0].url).toBe('Blog url')
})
