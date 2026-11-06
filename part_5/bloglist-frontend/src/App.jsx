import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './styles.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification({ message:'Wrong username or password', type:'error' })
      setTimeout(() => {
        setUsername('')
        setPassword('')
        setNotification(null)
      }, 3000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)
    blogService.setToken('')
    window.localStorage.removeItem('loggedUser')
  }

  const addBlog = async (blog) => {
    try{
      const addedBlog = await blogService.newBlog(blog)
      setBlogs(blogs.concat(addedBlog))
      setNotification({ message:`Added ${blog.title} by ${blog.author}`, type:'success' })
      blogFormRef.current.toggleVisibility()
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
    catch(exception)  {
      setNotification({ message:'Error adding new blog. Blog must have title, author and url.', type:'error' })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const likeBlog = async (id) => {
    const blog = blogs.find(blog => blog.id === id)
    try{
      const updatedBlog = await blogService.update(id, { ...blog, likes: blog.likes + 1 })
      setBlogs(blogs.map(blog => blog.id !== id ? blog : updatedBlog))
    }
    catch(exception){
      setNotification( { message:`Blog '${blog.title}' was already removed from server`, type:'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      setBlogs(blogs.filter(blog => blog.id !== id))
    }
  }

  const removeBlog = async(id) => {
    const blog = blogs.find(blog => blog.id === id)
    if (window.confirm(`Delete ${blog.title}?`)) {
      try{
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        setNotification({ message:`Deleted ${blog.title}`, type:'success' })
        setTimeout(() => {
          setNotification(null)
        }, 3000)
      }
      catch(exception){
        setNotification({ message:`Blog '${blog.title}' was already removed from server`, type:'error' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        setBlogs(blogs.filter(blog => blog.id !== id))
      }
    }
  }

  return (
    <div>
      {notification && <Notification notification={notification} />}
      {!user && <LoginForm username={username} password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />}
      {user &&
        <div>
          <h2>blogs</h2>
          <p>Welcome, {user.username}</p>
          <button id='logout-button' onClick={handleLogout}>Log out</button>
          <Togglable buttonLabel="New blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <ul>
            {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
              <Blog key={blog.id} blog={blog} handleLikeChange={() => likeBlog(blog.id)}
                handleRemove={() => removeBlog(blog.id)} loggedUser={user} />)}
          </ul>
        </div>
      }
    </div>
  )
}

export default App