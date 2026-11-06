import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const blog = { title: title, author: author, url: url }
    createBlog(blog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>New blog</h2>
      <form onSubmit={addBlog}>
        <label>
            Title
          <input id="title" value={title} onChange={event => setTitle(event.target.value)} />
        </label>
        <label>
            Author
          <input id="author" value={author} onChange={event => setAuthor(event.target.value)} />
        </label>
        <label>
            URL
          <input id="url" value={url} onChange={event => setUrl(event.target.value)} />
        </label>
        <button id="submit-blog" type="submit">Add</button>
      </form>
    </div >
  )
}
export default BlogForm