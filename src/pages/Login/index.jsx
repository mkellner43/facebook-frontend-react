import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/user';

const Login = ({setToken, setHasLogIn, setCurrentUser}) => {
  const navigate = useNavigate()
  const [error, setErrors] = useState(null)
  const username = useRef(null)
  const password = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    document.cookie = 'access_token= ; max-age=0'
    if(!username.current.value || !password.current.value){
      return setErrors('Username and password are required')
    }
    const credentials = JSON.stringify({
      username: username.current.value,
      password: password.current.value
    })
    login(credentials, setToken, navigate, setCurrentUser)
  }
  return (
    <>
      <form>
        <h1>Log In</h1>
        <input 
          ref={username}
          className='mt-1' 
          data-error={error ? true : false}
          type='text' 
          placeholder="username"
          required
          />
        <input 
          ref={password}
          className='mt-1' 
          data-error={error ? true : false} 
          type='password' 
          placeholder="password" 
          required
          />
        <button 
          className='btn mt-1'
          type="submit"
          onClick={handleSubmit}
          >
          Log In
        </button>
        <p className='error mt-1'>{error}</p>
      </form>
      <p>Don't have an account yet?</p>
      <button onClick={() => setHasLogIn(prevState => !prevState)}>Sign up</button>
    </>
  )
}

export default Login;