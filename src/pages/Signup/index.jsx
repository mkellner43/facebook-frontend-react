import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = ({setToken, setHasLogIn}) => {
  const navigate = useNavigate()
  const [error, setErrors] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      username: username,
      password: password,
      first_name: firstName,
      last_name: lastName
    }
    fetch(`http://localhost:3000/api/v1/users/registration`, {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then((res) => {
      if(res.status === 409) {
        setUsername('')
        setPassword('')
        setFirstName('')
        setLastName('')
        return setErrors('Account already exsists, please log in.')
      }
      if(!res.ok) return 
      res.json()
    })
    .then((data) => { 
      if(data) {
        sessionStorage.setItem('user', JSON.stringify(data))
        setToken()
        navigate('/')
      } 
    })
    .catch((err) => {
      console.error("Error:", err)
      setErrors(err)
    })

  }
  return (
    <>
      <form>
        <h1>Sign Up</h1>
        <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className='mt-1' 
        data-error={error ? true : false} 
        type='text' 
        placeholder="First Name" 
        />
        <input 
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className='mt-1' 
        data-error={error ? true : false} 
        type='text' 
        placeholder="Last Name" 
        />
        <input 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='mt-1' 
          data-error={error ? true : false}
          type='text' 
          placeholder="Username"
          />
        <input 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='mt-1' 
          data-error={error ? true : false} 
          type='password' 
          placeholder="Password" 
          />
        <button 
          className='btn mt-1'
          type="submit"
          onClick={handleSubmit}
          >
          Sign Up
        </button>
        <p className='error mt-1'>{error}</p>
      </form>
      <p>Already have an account?</p>
      <button onClick={() => setHasLogIn(prevState => !prevState)}>Log In</button>
    </>
  )
}

export default Signup;