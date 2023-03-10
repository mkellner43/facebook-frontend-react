import { Typography, TextField, Button } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/user';
import { useMutation } from '@tanstack/react-query';

const Login = ({setCurrentUser, setToken}) => {
  const navigate = useNavigate()
  const [usernameError, setUsernameError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submitLogin = useMutation({
    mutationFn: ({credentials, setToken, navigate, setCurrentUser}) => 
    login(credentials, setToken, navigate, setCurrentUser),
    onSuccess: () => {
      console.log('you did it!')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    document.cookie = 'access_token= ; max-age=0'
    !username ? setUsernameError('Username is required') : setUsernameError(null)
    !password ? setPasswordError('Password is required') : setPasswordError(null)
    if(username && password) {
      const credentials = JSON.stringify({
        username: username,
        password: password
      })
      submitLogin.mutate({credentials, setToken, navigate, setCurrentUser})
    }
  }
  return (
    <form style={{display: 'flex', justifyContent:'center', alignContent: 'center'}}>
    <Grid2 container spacing={2} mt={5} width={250} justifyContent='center' alignItems='center'>
      <Grid2 xs={12}>
        <Typography variant='h2' component='h1' textAlign='center'>
          Log In
        </Typography>
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
      <Grid2 xs={12}>
        <Button 
          type="submit"
          onClick={handleSubmit}
          variant='contained'
          fullWidth
          >
          Sign In
        </Button>
      </Grid2>
      <Grid2>
        <Typography variant='body1'>Don't have an account yet?</Typography>
      </Grid2>
      <Grid2>
        <Button variant='outlined' type='button' onClick={() => navigate('/signup')}>
          Sign up
        </Button>
      </Grid2>  
    </Grid2>
    </form>
  )
}

export default Login;