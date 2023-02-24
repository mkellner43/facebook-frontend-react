import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Nav from './components/Nav';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import useToken from './useToken';
import Friends from './pages/Friends';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import { SocketProvider } from './context/SocketProvider';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const queryClient = new QueryClient();

const App = () => {
  const currentUser = JSON.parse(sessionStorage.getItem('user'))
  let {token, setToken} = useToken();
  const [stale, setStale] = React.useState(false);

  if(!token || currentUser?.token !== token ) return <Auth setToken={setToken}/>

  return (
    <SocketProvider value={currentUser?.id}>
    <QueryClientProvider client={queryClient} >
    <CssBaseline/>
      <Nav currentUser={currentUser} setToken={setToken}/>
      <Routes>
        <Route element={<Home currentUser={currentUser} setToken={setToken} setStale={setStale} stale={stale} token={token} />} path="/"/>
        <Route element={<Profile currentUser={currentUser} setToken={setToken} setStale={setStale} stale={stale} />} path="/profile" />
        <Route element={<Friends currentUser={currentUser} setToken={setToken} setStale={setStale} stale={stale} />} path="/friends" />
        <Route element={<Messages currentUser={currentUser} setToken={setToken} setStale={setStale} stale={stale} />} path='/messages' />
        <Route element={<Notifications currentUser={currentUser} setToken={setToken} setStale={setStale} stale={stale} />} path='/notifications' />
      </Routes>
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </SocketProvider>
  );
}

export default App;


// goal- create a facebook front end to use rails as the back end
