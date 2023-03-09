import { useState } from 'react';
import Signup from '../Signup';
import LogIn from '../Login';

const Auth = ({setToken, setCurrentUser}) => {
  const [hasLogIn, setHasLogIn] = useState(true);

  if(hasLogIn) {
    return <LogIn setHasLogIn={setHasLogIn} setToken={setToken} setCurrentUser={setCurrentUser}/>
  } else {
    return <Signup setHasLogIn={setHasLogIn} setToken={setToken} setCurrentUser={setCurrentUser}/>
  }
}

export default Auth;