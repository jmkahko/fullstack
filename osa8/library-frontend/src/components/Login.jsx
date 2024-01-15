import { useState, useEffect } from 'react'
import { USER_LOGIN } from "../query"
import { useMutation } from "@apollo/client"

const Login = ({ show, setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [ login, result ] = useMutation(USER_LOGIN)

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      localStorage.setItem('books-user-token', token)
      setToken(token)
    }
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault()

    login({
      variables: { username, password }
    })
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login