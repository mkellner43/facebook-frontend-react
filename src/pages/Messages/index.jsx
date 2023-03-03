import React, {useEffect, useState, useRef} from 'react';
import { Card, Typography, Button, Chip, Avatar, TextField, IconButton, Paper, CircularProgress, Box } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { getFriends } from '../../api/friends';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChatBubble, Send } from '@mui/icons-material';
import { getMessages, sendMessage, getThread } from '../../api/message';
import {format} from 'date-fns';
 
const Messages = ({currentUser, setToken}) => {
  const [friend, setFriend] = useState(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const queryClient = useQueryClient();
  const scroll = useRef();

  const friendQuery = useQuery({queryKey: ['friends'], queryFn: () => getFriends(setToken)})
  const messageQuery = useQuery({queryKey: ['messages'], queryFn: () => getMessages(setToken)})
  const sendMessageQuery = useMutation({
    mutationFn: (to_id) => sendMessage(message, to_id, setToken),
    onSuccess: () => {
      setMessage('')
      queryClient.invalidateQueries(['messages'])
      queryClient.invalidateQueries(['thread'])
    }
  })
  const threadQuery = useQuery({
    queryKey: ['thread'],
    queryFn: () => getThread(friend._id, setToken),
    enabled: !!friend
  })
  
  useEffect(() => {
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
    return threadQuery.isSuccess && 
      threadQuery.data.messages.map(message => 
        {
          const senderWasCurrentUser = message.sender === currentUser.id
         return <Grid2 container ref={scroll} p={3} xs={12} key={message._id} flexDirection="column" justifyContent='center' alignItems={senderWasCurrentUser ? 'flex-end' : 'flex-start'} flexWrap='nowrap'>
          <Grid2 >
            <Typography variant='caption'>
              {format(new Date(message.date), 'Pp')}
            </Typography>
          </Grid2>
          <Grid2 container alignItems='center' flexDirection={senderWasCurrentUser ? 'row' : 'row-reverse'} flexWrap='nowrap'>
            <Grid2>
              <Typography variant='body1' sx={{backgroundColor: '#1976d2', color: '#fff', pl: 1.5, pr: 1.5, pt: .5, pb: .5, borderRadius: '.25rem'}}>
                {message.message}
              </Typography>
            </Grid2>
            <Grid2 flexShrink={0}>
            <Avatar>{(senderWasCurrentUser ? currentUser.first_name.split('')[0] + currentUser.last_name.split('')[0] : friend.first_name.split('')[0] + friend.last_name.split('')[0])}</Avatar>
            </Grid2>
          </Grid2>
        </Grid2>
        }
      )
  }
  

  return (
    <Grid2 container spacing={{xs: 0, sm: 1}} justifyContent="space-evenly">
      <Grid2 container item spacing={0} xs={4} sm={4} flexDirection='column' alignItems={'center'} >
        <Card variant="outlined" sx={{width: 1}}>
        <Typography variant="h4" component='h1' textAlign='center'>
          Chats
        </Typography>
        <Grid2 m={1}>
          <TextField label="Search" variant="filled" size='small' fullWidth value={search} onChange={handleSearch}/>
          <Card>
            {searchResults.length > 0 &&
              searchResults.map(result => {
                return <Button 
                  key={result.user._id} 
                  fullWidth 
                  onClick={() => {
                    setFriend(result.user)
                    setSearch('')
                    setSearchResults([])
                  }}
                  >
                    {console.log(result.user.first_name.split('')[0])}
                    <Avatar sx={{m:1}}>{result.user.first_name.split('')[0] + result.user.last_name.split('')[0]}</Avatar>
                    {result.user.username} 
                    </Button>
              })
            }
          </Card>
        </Grid2>
        <Grid2>
          { messageQuery.isLoading && <CircularProgress />}
          { messageQuery.isSuccess && 
            messageQuery.data.map(thread => {
              const friend = thread.users.filter(user => user._id !== currentUser.id)[0]
              return <Button key={friend._id} fullWidth onClick={() => setFriend(friend)}>
              <Avatar sx={{m:1}}>{friend.first_name.split('')[0] + friend.last_name.split('')[0]}</Avatar>
              {friend.username}
            </Button>
            })
          }
        </Grid2>
        </Card>
      </Grid2>
      <Grid2 container xs={8} sm={7} overflow="hidden" height='85vh' sx={{border: threadQuery.isSuccess && '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '1%'}}>
        {!threadQuery.isSuccess &&
          <Grid2 xs={12}>
            <Typography variant="h4" component='h1' textAlign='center'>
              No chats opened
            </Typography> 
          </Grid2>
          }
          {threadQuery.isSuccess && 
          <>
          <Grid2 xs={12} columns={1}>
            <Paper elevation={5} height={1} sx={{background: 'rgba(0, 0, 0, 0.12) '}}>
              <Typography variant="h4" component='h1' textAlign={'center'}>
                {friend.username}
              </Typography>
            </Paper>
          </Grid2>
          <Grid2 container mt={.05} xs={12} height={.88} flexDirection='column' overflow={'scroll'} flexWrap='nowrap'>
              { getThreadMessages() }
          </Grid2>
          <Grid2 container xs={12} alignItems='center' justifyContent='center'>
            <Grid2 xs={11}>
              <TextField fullWidth id="outlined-basic" label="Type a new message" variant="outlined" size='small' value={message} onChange={(e) => setMessage(e.target.value)}/>
            </Grid2>
            <Grid2 xs={1} columns={1}>
              <IconButton 
                onClick={() => sendMessageQuery.mutate(friend._id)}
                disabled={message.trim().length === 0}
                >
              <Send color='primary'/>
            </IconButton>
            </Grid2>
          </Grid2>
          </>
          }
      </Grid2>
    </Grid2>
  )
}

export default Messages;
