import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import Nav from './components/Nav';

const App = () => {
  const currentUser = { username: 'mkellner43', name: 'Matt'}

  return (
    <>
    <CssBaseline/>
    <Nav currentUser={currentUser}/>
    <Routes>
      <Route element={<Home currentUser={currentUser} />} path="/"/>
    </Routes>
    </>
  );
}

export default App;


// goal- create a facebook front end to use rails as the back end
