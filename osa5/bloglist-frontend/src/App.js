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
    } catch (e) {
      console.log('error : ', e)
    }
  }

  const handleLogOut = (event) => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
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
    })
    .catch((e) => {
      console.log('error ', e)
    })
  }

  if (user === null) {
    return (
      <div>
        <h1>Login to application</h1>
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