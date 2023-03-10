import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Button } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { createUser } from '../../api/user';
import { useMutation } from '@tanstack/react-query';

const Signup = () => {
  const navigate = useNavigate()
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState(null);

  const submitNewUser = useMutation({
    mutationFn: ({data, setError}) => 
      createUser(data, setError),
    onSuccess: (data, variables, context) => {
      console.log(data, variables, context)
      data.msg === 'user created!' &&
      navigate('/login')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if(validation()) {
      const data = JSON.stringify({
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName
      })
      submitNewUser.mutate({data, setError})
    }
  }
  const validation = () => {
    setUsernameError(null);
    setPasswordError(null);
    setFirstNameError(null);
    setLastNameError(null);
    !username && setUsernameError('Username is required')
    !password && setPasswordError('Password is required')
    !firstName && setFirstNameError('First name is required')
    !lastName && setLastNameError('Last name is required')
    if(username && password && firstName && lastName) return true 
    return false
  }
  
  return (
    <form style={{display: 'flex', justifyContent:'center', alignContent: 'center'}}>
      <Grid2 container spacing={2} mt={5} width={250} justifyContent='center' alignItems='center' flexDirection='column'>
        <Grid2 xs={12}>
          <Typography variant='h2' component='h1' textAlign='center'>
            Sign Up
          </Typography>
        </Grid2>
        <Grid2 xs={12}>
          <TextField
            error={firstNameError !== null}
            helperText={firstNameError}
            fullWidth
            value={firstName}
            name='first-name'
            onChange={(e) => setFirstName(e.target.value)}
            size='small'
            label="First Name"
            type="text"
          />
        </Grid2>
        <Grid2 xs={12}>
          <TextField
            error={lastNameError !== null}
            helperText={lastNameError}
            fullWidth
            value={lastName}
            name='last-name'
            onChange={(e) => setLastName(e.target.value)}
            size='small'
            label="Last Name"
            type="text"
          />
        </Grid2>
        <Grid2 xs={12}>
          <TextField
            error={usernameError !== null}
            helperText={usernameError}
            fullWidth
            value={username}
            name='username'
            onChange={(e) => setUsername(e.target.value)}
            size='small'
            label="Username"
            type="text"
          />
        </Grid2>
        <Grid2 xs={12}>
          <TextField
            error={passwordError !== null}
            helperText={passwordError}
            fullWidth
            value={password}
            name='password'
            onChange={(e) => setPassword(e.target.value)}
            size='small'
            label="Password"
            type="password"
            autoComplete='new-password'
          />
        </Grid2>
        <Grid2 xs={12} p={1}>
          <Button 
            type="submit"
            onClick={handleSubmit}
            variant='contained'
            fullWidth
            >
            Creat Account
          </Button>
        </Grid2>
        <Grid2>
          <Typography variant='body1'>Already have an account?</Typography>
        </Grid2>
        <Grid2>
        <Button variant='outlined' type='button' onClick={() => navigate('/login')}>
          Log In
        </Button>
        </Grid2>
        <Grid2>
          <Typography color='error'>{error}</Typography>
        </Grid2>
      </Grid2>
    </form>
  )
}

export default Signup;

// creating new user is working, just need to redirect correctly to login