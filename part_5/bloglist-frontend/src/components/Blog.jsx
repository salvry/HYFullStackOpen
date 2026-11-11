import { Button, BlogPage } from './StyledComponents'

const Blog = ({ blog, handleLikeChange, handleRemove, loggedUser }) => {

  if(!blog) {
    return null
  }
  return (
    <BlogPage>
      <h2>{blog.title}</h2>
      <h3>{blog.author}</h3>
        <div className="blog-url">
          <a href="">{blog.url}</a>
        </div>
        <div>Blog added by: {blog.user.username}</div>
        <div>
          Likes: {blog.likes}
          {loggedUser && 
          <Button className="like-button" onClick={handleLikeChange}>Like</Button>
          }
          {loggedUser && loggedUser.username === blog.user.username &&
          <Button className="remove-button" onClick={handleRemove}>Remove</Button>
        }
        </div>
      </BlogPage>
  )
}

export default Blog