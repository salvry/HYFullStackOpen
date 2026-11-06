const LoginForm = ({ handleSubmit, username, password, handleUsernameChange, handlePasswordChange }) => {
  return (
    <div>
      <h2>Log in</h2>
      <form onSubmit={handleSubmit}>
        <label>
            username
          <input id="username" value={username} onChange={handleUsernameChange} />
        </label>
        <label>
            password
          <input id="password" type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <button id="login-button" type="submit">Log in</button>
      </form>
    </div>
  )
}

export default LoginForm