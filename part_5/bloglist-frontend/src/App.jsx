import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import Blogs from './components/Blogs'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import { Page, Navigation, Button } from './components/StyledComponents'
import blogService from './services/blogs'
import loginService from './services/login'
import './styles.css'
import {
  Routes, Route, Link, useNavigate, useMatch
} from 'react-router-dom'



const App = () => {
  const [blogs, setBlogs] = useState([])

  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

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

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)

      navigate('/')
    } catch (exception) {
      setNotification({ message:'Wrong username or password', type:'error' })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)
    blogService.setToken('')
    window.localStorage.removeItem('loggedUser')
    navigate('/')
  }

  const addBlog = async (blog) => {
    try{
      const addedBlog = await blogService.newBlog(blog)
      setBlogs(blogs.concat(addedBlog))
      setNotification({ message:`Added ${blog.title} by ${blog.author}`, type:'success' })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
      navigate('/')
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
        navigate('/')
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
    <Page>
      <Navigation className="navigation">
        <h1>Blog app</h1>
        <Link to="/">Blogs</Link>
        {!user &&
          <Link  to="/login">Log in</Link>
        }
        {user &&
            <>
              <Link to="/create">Add new blog</Link>
              <Button id='logout-button' onClick={handleLogout}>Log out</Button>
            </>
        }
      </Navigation>
      {notification && <Notification notification={notification} />}
      <Routes>
        <Route path="/" element={
          <Blogs blogs={blogs} loggedUser={user} notification={notification} />
        } />
        <Route path="/login" element={
          <LoginForm login={handleLogin} user={user} />
        } />
        <Route path="/blogs/:id" element={
          <Blog blog={blog} handleLikeChange={() => likeBlog(blog.id)} handleRemove={() => removeBlog(blog.id)} loggedUser={user} />
        } />
        <Route path="/create" element={
          <BlogForm createBlog={addBlog}/>
        } />
      </Routes>
    </Page>
  )
}

export default App