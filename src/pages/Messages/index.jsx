import React, {useEffect, useState, useRef} from 'react';
import { Card, Typography, Button, Avatar, TextField, IconButton, Paper, CircularProgress, Grid } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { getFriends } from '../../api/friends';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Send } from '@mui/icons-material';
import { getMessages, sendMessage, getThread } from '../../api/message';
import {format} from 'date-fns';
import { useSocket } from '../../context/SocketProvider';
import './style.scss';
 
const Messages = ({currentUser, setToken}) => {
  const [friend, setFriend] = useState(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const queryClient = useQueryClient();
  const scroll = useRef();
  const socket = useSocket();
  const [typing, setTyping] = useState(false);

  socket?.on('message received', (data) => {
    queryClient.setQueryData(['thread'], data)
    queryClient.invalidateQueries(['notifications'])
    queryClient.invalidateQueries(['messages'])
    queryClient.invalidateQueries(['thread'])
  })

  socket?.on('typing', () => setTyping(true))
  socket?.on('not typing', () => setTyping(false))

  const friendQuery = useQuery({queryKey: ['friends'], queryFn: () => getFriends(setToken)})
  const messageQuery = useQuery({queryKey: ['messages'], queryFn: () => getMessages(setToken)})
  const sendMessageQuery = useMutation({
    mutationFn: (to_id) => sendMessage(message, to_id, setToken),
    onSuccess: (data, variables) => {
      setMessage('')
      socket.emit('send message', {id: variables, thread: data})
      queryClient.setQueryData(['thread'], data)
      queryClient.invalidateQueries(['messages'])
      queryClient.invalidateQueries(['thread'])
    }
  })
  const threadQuery = useQuery({
    queryKey: ['thread', friend?._id],
    queryFn: () => getThread(friend._id, setToken),
    enabled: !!friend,
    onSuccess: () => {
      queryClient.invalidateQueries(['messages'])
    }
  })

  useEffect(() => {
    if(!threadQuery) return
    scroll.current?.scrollIntoView({})
  }, [threadQuery])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setSearchResults(friendQuery.data.filter( friend => {
      if(e.target.value.trim().length === 0) return null
      return friend.user.username.includes(e.target.value)
    }
      ))
  }

  const getThreadMessages = () => {
    if(threadQuery.data.messages.length === 0) return <Typography sx={{position: 'relative', top: '50%', textAlign: 'center', width: 1}}>No Messages Yet</Typography>
    return threadQuery.data.messages.map(message => {
    const senderWasCurrentUser = message.sender === currentUser.id
    return (
      <Grid2 container ref={scroll} p={3} xs={12} key={message._id} flexDirection="column" justifyContent='center' alignItems={senderWasCurrentUser ? 'flex-end' : 'flex-start'} flexWrap='nowrap'>
        <Grid2 >
          <Typography variant='caption'>
            {format(new Date(message.date), 'Pp')}
          </Typography>
        </Grid2>
        <Grid2 container alignItems='center' flexDirection={senderWasCurrentUser ? 'row' : 'row-reverse'} flexWrap='nowrap'>
          <Grid2>
            <Typography variant='body1' sx={{backgroundColor: senderWasCurrentUser ? '#1976d2' : 'grey', color: '#fff', pl: 1.5, pr: 1.5, pt: .5, pb: .5, borderRadius: '.25rem'}}>
              {message.message}
            </Typography>
          </Grid2>
          <Grid2 flexShrink={0}>
          <Avatar>{(senderWasCurrentUser ? currentUser.first_name.split('')[0] + currentUser.last_name.split('')[0] : friend?.first_name.split('')[0] + friend?.last_name.split('')[0])}</Avatar>
          </Grid2>
        </Grid2>
      </Grid2>)}
  )}
      
  return (
    <Grid2 container spacing={{xs: 0, sm: 1}} justifyContent="space-evenly">
      <Grid2 container xs={4} sm={4} flexDirection='column' alignItems={'center'} >
        <Card variant="outlined" sx={{width: 1}}>
          <Typography p={1} variant="h4" component='h1' textAlign='center'>
            Chats
          </Typography>
          <Grid2 m={1}>
            <TextField label="Search" variant="filled" size='small' fullWidth value={search} onChange={handleSearch}/>
            { searchResults.length > 0 && searchResults.map(result => 
              <Button 
                key={result.user._id} 
                fullWidth 
                onClick={() => {
                  setFriend(result.user)
                  setSearch('')
                  setSearchResults([])
                }} >
                <Avatar sx={{m:1}}>
                  {result.user.first_name.split('')[0] + result.user.last_name.split('')[0]}
                </Avatar>
                {result.user.username} 
              </Button>) }
          </Grid2>
          <Grid2>
            { messageQuery.isLoading && <CircularProgress /> }
            { messageQuery.isSuccess && 
              messageQuery.data.map(thread => {
                const friend = thread.users.filter(user => user._id !== currentUser.id)[0]
                return <Button key={friend?._id} fullWidth onClick={() => setFriend(friend)}>
                  <Avatar sx={{m:1}}>{friend?.first_name.split('')[0] + friend?.last_name.split('')[0]}</Avatar>
                  {friend?.username}
                </Button> }) }
          </Grid2>
        </Card>
      </Grid2>
        {!threadQuery.data &&
        <Grid2 container xs={8} sm={7} alignItems='center' flexDirection='column'>
            <Typography variant="h4" component='h1' mb={1}>
              No chats opened
            </Typography> 
            {threadQuery.isLoading && friend && <CircularProgress />}
        </Grid2>}
        {threadQuery.isSuccess && friend && 
          <Grid2 container xs={8} sm={7} height='85vh' overflow='hidden' sx={{border: threadQuery.isSuccess && '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '1%'}}>
            <Grid2 xs={12} >
              <Paper elevation={5} sx={{background: 'rgba(0, 0, 0, 0.12)', width: 1}}>
                <Typography variant="h4" component='h1' textAlign={'center'} >
                  {friend?.username}
                </Typography>
              </Paper>
            </Grid2>
            <Grid2 container minHeight={.87} maxHeight={.87} width={1} flexDirection='column' overflow='scroll' flexWrap='nowrap' >
              { getThreadMessages() }
              { typing && <Grid2 m={3} >
                <div style={{height: '1.5rem', width: '4rem', backgroundColor: 'gray', borderRadius: '.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', position: 'relative', bottom: 0}}>
                  <span className='dot1'/>
                  <span className='dot2'/>
                  <span className='dot3'/>
                </div>
              </Grid2> }
            </Grid2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessageQuery.mutate(friend?._id) }}
                style={{width: '100%'}} >
            <Grid2 container xs={12} alignItems='center' justifyContent='center'>
              <Grid2 xs={11}>
                <TextField fullWidth id="outlined-basic" label="Type a new message" variant="outlined" size='small' value={message} 
                  onChange={(e) => {
                    socket.emit('typing', friend?._id)
                    setMessage(e.target.value)}}
                    onFocus={() => socket.emit('typing', friend?._id)} onBlur={() => socket.emit('not typing', friend?._id)} />
              </Grid2>
              <Grid2 xs={1} >
                <IconButton 
                  type='submit'
                  disabled={message.trim().length === 0} >
                  <Send color='primary' />
                </IconButton>
              </Grid2>
            </Grid2>
          </form>
      </Grid2>
        }
    </Grid2>)
}

export default Messages;

// add notifications, live connection, and status indicators, ... bubble on typing would be cool