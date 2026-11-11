import { useState } from 'react'
import { Button, Input, Form, FormGroup } from './StyledComponents'

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
      <Form className="form" onSubmit={addBlog}>
        <FormGroup>
          <label htmlFor="title">Title</label>
          <Input id="title" value={title} onChange={event => setTitle(event.target.value)} />
        </FormGroup>
        <FormGroup>
          <label htmlFor="author">Author</label>
          <Input id="author" value={author} onChange={event => setAuthor(event.target.value)} />
        </FormGroup>
        <FormGroup>
          <label htmlFor="url">URL</label>
          <Input id="url" value={url} onChange={event => setUrl(event.target.value)} />
        </FormGroup>
        <Button id="submit-blog" type="submit">Add</Button>
      </Form>
    </div >
  )
}
export default BlogForm