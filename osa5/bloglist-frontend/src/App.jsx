import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import NewBlogForm from './components/NewBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [informationMessage, setInformationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [newBlogVisible, setNewBlogVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBlogUser')

    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
      setInformationMessage(`User ${user.name} is sign in`)
      setTimeout(() => {
        setInformationMessage(null)
      }, 2000)
    } catch (e) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
    setInformationMessage('User logged out')
    setTimeout(() => {
      setInformationMessage(null)
    }, 2000)
  }

  const handleUpdateBlog = async (updateBlog) => {
    blogService
      .updateBlog(updateBlog.id, updateBlog)
      .catch(() => {
        setErrorMessage('blog some error in adding likes')
        setTimeout(() => {
          setErrorMessage(null)
        }, 2000)
      })

    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }

  const handleDeleteBlog = async (deleteBlog) => {
    if (window.confirm(`Remove ${deleteBlog.title} by ${deleteBlog.author} ?`)) {
      blogService
        .deleteBlog(deleteBlog.id)
        .then(() => {
          setInformationMessage(`Blog '${deleteBlog.title}' removed`)
          setTimeout(() => {
            setInformationMessage(null)
          }, 2000)
          blogService.getAll().then(blogs =>
            setBlogs( blogs )
          )
        })
        .catch(() => {
          setErrorMessage(`The blog '${deleteBlog.title}' remove operation failed`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 2000)
        })
    }
  }

  const handleCreateNewBlog = async (newBlogObject) => {
    blogService
      .createNewBlog(newBlogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setInformationMessage(`a new blog ${newBlogObject.title} ${newBlogObject.author} added`)
        setTimeout(() => {
          setInformationMessage(null)
        }, 2000)
      })
      .catch(() => {
        setErrorMessage('a new blog some error in adding')
        setTimeout(() => {
          setErrorMessage(null)
        }, 2000)
      })
  }

  const InformationNotification = ({ message }) => {
    if (message === null) {
      return null
    }

    return (
      <div className='information'>
        {message}
      </div>
    )
  }

  const ErrorNotification = ({ message }) => {
    if (message === null) {
      return null
    }

    return (
      <div className='error'>
        {message}
      </div>
    )
  }

  if (user === null) {
    return (
      <div>
        <h1>Login to application</h1>
        <InformationNotification message={informationMessage} />
        <ErrorNotification message={errorMessage} />
        <form onSubmit ={handleLogin}>
          <div>
            username <input type="text" value={username} name="Username" id="username" onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password <input type="password" value={password} name="Password" id="password" onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit" id="loginButton">Login</button>
        </form>
      </div>
    )
  } else {
    const hideWhenVisible = { display: newBlogVisible ? 'none' : '' }
    const showWhenVisible = { display: newBlogVisible ? '' : 'none' }

    return (
      <div>
        <h2>Blogs</h2>
        <InformationNotification message={informationMessage} />
        <ErrorNotification message={errorMessage} />
        <p>{user.name} logged in <button onClick={handleLogOut} id="logoutButton">Logout</button></p>

        <div style={hideWhenVisible}>
          <button onClick={() => setNewBlogVisible(true)} id="createNewBlogButton">Create new blog</button>
        </div>

        <div style={showWhenVisible}>
          <NewBlogForm createNewBlog={handleCreateNewBlog} />
          <button onClick={() => setNewBlogVisible(false)}>Cancel</button>
        </div>

        <h2>blogs</h2>
        {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id} blog={blog} user={user} updateBlogLikes={handleUpdateBlog} deleteBlog={handleDeleteBlog} />
        )}
      </div>
    )
  }
}

export default App