import { useState } from 'react';
import Signup from '../Signup';
import LogIn from '../Login';

const Auth = ({setToken}) => {
  const [hasLogIn, setHasLogIn] = useState(true);

  if(hasLogIn) {
    return <LogIn setHasLogIn={setHasLogIn} setToken={setToken}/>
  } else {
    return <Signup setHasLogIn={setHasLogIn} setToken={setToken}/>
  }
}

export default Auth;