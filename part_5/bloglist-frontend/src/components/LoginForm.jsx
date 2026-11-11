import { useState } from 'react'
import { Button, Input, Form, FormGroup } from './StyledComponents'

const LoginForm = ({ login, user }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin =  (event) => {
    event.preventDefault()
    login(username, password)
    setUsername('')
    setPassword('')
  }
  if(!user){
    return (
      <div>
        <h2>Log in</h2>
        <Form className="form" onSubmit={handleLogin}>
          <FormGroup>
            <label htmlFor="username">Username</label>
            <Input id="username" value={username} onChange={event => setUsername(event.target.value)} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="password">Password</label>
            <Input id="password" type="password" value={password} onChange={event => setPassword(event.target.value)} />
          </FormGroup>
          <Button id="login-button" type="submit">Log in</Button>
        </Form>
      </div>
    )
  }
}

export default LoginForm