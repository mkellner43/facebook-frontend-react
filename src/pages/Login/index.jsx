import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
    const data = {
      username: username.current.value,
      password: password.current.value
    }
    fetch('http://localhost:3000/api/v1/users/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => { 
      console.log(data)
      if(data) {
        sessionStorage.setItem('user', JSON.stringify(data))
        setToken()
        navigate('/')
      } 
    })
    .catch((err) => {
      console.error("Error:", err.message)
      setErrors('Invalid username or password')
    })
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