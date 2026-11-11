import { Link } from 'react-router-dom'

const Blogs = ({ blogs,  loggedUser }) => {

  return (
    <div>
      {loggedUser &&
        <div>
          <h2>Blogs</h2>
          <p>Welcome, {loggedUser.username}</p>
        </div >
      }
      <div>
        <ul>
          {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title} </Link>
            </li>
          )}
        </ul>
      </div >
    </div>
  )
}

export default Blogs