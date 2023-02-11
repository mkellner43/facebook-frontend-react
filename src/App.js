import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Nav from './components/Nav';
import Auth from './pages/Auth';
import useToken from './useToken';

const App = () => {
  const currentUser = JSON.parse(sessionStorage.getItem('user'))
  let {token, setToken} = useToken();

  if(!token) {
    return <Auth setToken={setToken}/>
  }
  
  return (
    <>
    <CssBaseline/>
    <Nav currentUser={currentUser} setToken={setToken}/>
    <Routes>
      <Route element={<Home currentUser={currentUser} setToken={setToken}/>} path="/"/>
    </Routes>
    </>
  );
}

export default App;


// goal- create a facebook front end to use rails as the back end
