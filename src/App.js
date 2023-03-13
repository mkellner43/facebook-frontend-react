import React, {useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Nav from './components/Nav';
import Profile from './pages/Profile';
import useToken from './useToken';
import Friends from './pages/Friends';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import { SocketProvider } from './context/SocketProvider';
import Login from './pages/Login';
import Signup from './pages/Signup';

const App = () => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('user')))
  let {token, setToken} = useToken();

  if(!token || currentUser?.token !== token ) return (
    <Routes>
      <Route element={ <Login setCurrentUser={setCurrentUser} setToken={setToken}/> } path='/login' />
      <Route element={ <Signup /> } path='/signup' />
      <Route element={ <Login setCurrentUser={setCurrentUser} setToken={setToken} /> } path='*' />
    </Routes>
  )
  
  return (
    <SocketProvider value={currentUser?.id}>
      <CssBaseline/>
      <Nav currentUser={currentUser} setToken={setToken} />
      <Routes>
        <Route element={<Home currentUser={currentUser} setToken={setToken} />} path="/"/>
        <Route element={<Profile currentUser={currentUser} setToken={setToken} setCurrentUser={setCurrentUser} />} path="/profile" />
        <Route element={<Friends currentUser={currentUser} setToken={setToken}  />} path="/friends" />
        <Route element={<Messages currentUser={currentUser} setToken={setToken} />} path='/messages' />
        <Route element={<Notifications currentUser={currentUser} setToken={setToken} />} path='/notifications' />
        <Route element={<Home currentUser={currentUser} setToken={setToken}/>} path='*'/>
      </Routes>
   </SocketProvider>
  );
}

export default App;

// status indictors to see who is online
// look into client error handling
// refactor and seperate code for easier reading and working with
// work on placeholders while data is loading
