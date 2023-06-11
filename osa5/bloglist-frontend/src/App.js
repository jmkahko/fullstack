import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [informationMessage, setInformationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
      setTitle('')
      setAuthor('')
      setUrl('')
      setInformationMessage(`User ${user.name} is sign in`)
      setTimeout(() => {
        setInformationMessage(null)
      }, 2000)
    } catch (e) {
      setErrorMessage(`Wrong username or password`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
  }

  const handleLogOut = (event) => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
    setInformationMessage(`User logged out`)
    setTimeout(() => {
      setInformationMessage(null)
    }, 2000)
  }

  const handleCreateNewBlog = async (event) => {
    event.preventDefault()

    const newBlogObject = {
      title: title,
      author: author,
      url: url
    }

    blogService
    .createNewBlog(newBlogObject)
    .then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setInformationMessage(`a new blog ${newBlogObject.title} ${newBlogObject.author} added`)
      setTimeout(() => {
        setInformationMessage(null)
      }, 2000)
    })
    .catch((e) => {
      setErrorMessage(`a new blog some error in adding`)
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
            username <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    )
  } else {
    return (
      <div>
        <h2>Blogs</h2>
        <InformationNotification message={informationMessage} />
        <ErrorNotification message={errorMessage} />
        <p>{user.name} logged in <button onClick={handleLogOut}>Logout</button></p>

        <h2>Create new</h2>
        <form onSubmit ={handleCreateNewBlog}>
          <div>
            title <input type="text" value={title} name="Title" onChange={({ target }) => setTitle(target.value)} />
          </div>
          <div>
            author <input type="text" value={author} name="Author" onChange={({ target }) => setAuthor(target.value)} />
          </div>
          <div>
            url <input type="text" value={url} name="Url" onChange={({ target }) => setUrl(target.value)} />
          </div>
          <button type="submit">Create</button>
        </form>

        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }
}

export default App