import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { getFriends, getPendingRequests, getSuggestions, sendFriendRequest, acceptFriend, declineFriend } from '../../api/friends';
import { Button, Card, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {Chip, Avatar, Box} from '@mui/material';

const Friends = ({setToken}) => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([])
  const [pending, setPending] = useState([])
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    getFriends(setToken, setFriends)
    getPendingRequests(setToken, setPending)
    getSuggestions(setToken, setSuggestions)
  }, [setToken])

  const mapFriends = () => {
    return friends.length === 0 ?
    <Typography>No current friends</Typography>
    :
    friends.map(friend => {
      return <Chip
        key={friend.user._id}
        clickable
          avatar= {
            <Avatar>
              {friend.user.first_name.split('')[0]}
              {friend.user.last_name.split('')[0]}
            </Avatar>
          } 
        label={friend.user.first_name + " " + friend.user.last_name} 
        variant='outlined' 
        onClick={() => navigate('/profile', {state: {id: friend.user._id, user: friend.user}})}
      />
    })
  }
  const mapPending = () => {
    return pending.length === 0 ?
    <Typography>No pending friend requests</Typography>
    :
    pending.map(friend => {
      return (
        <Card key={friend.request_id} variant="outlined" sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, m: 1, maxWidth: '500px', width: "100vw", minWidth: '200px'}}>
          <Avatar
            variant='outlined'
            sx={{mr: 1}}
            onClick={() => navigate('/profile', {state: {id: friend.user._id, user: friend.user}})}
            >
            {friend.user.first_name.split('')[0]}
            {friend.user.last_name.split('')[0]}
          </Avatar>
          <Typography variant='h5' component='h2' flexGrow={1} noWrap
           onClick={() => navigate('/profile', {state: {id: friend.user._id, user: friend.user}})}
          >
            {console.log(friend.user._id)}
            {friend.user.first_name + ' ' + friend.user.last_name}
          </Typography>
            {friend.type !== 'receiver' ?
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <Button variant='outlined' color="success" size='small' onClick={() => acceptFriend(friend.request_id, setToken, setPending, setSuggestions)}>Accept</Button>
              <Button variant='outlined' color="error" size='small' sx={{mt: 1}} onClick={() => declineFriend(friend.request_id, setToken, setPending, setSuggestions)}>Decline</Button>
            </Box>
            :
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <Chip color='warning' variant='filled'label='PENDING...' />
            </Box>
            }
        </Card>
      )
    })
  }

  const mapSuggestions = () => {
    return suggestions.length === 0 ?
    <Typography>No suggestions</Typography>
    :
    suggestions.map(friend => {
      return(
        <Card 
          key={friend._id}
          variant="outlined"
          sx={{
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center', 
            p: 2, m: 1, maxWidth: '500px',
             width: "100vw", minWidth: '200px'
          }}
        >
          <Avatar
            variant='outlined'
            sx={{mr: 1}}
            onClick={() =>
              navigate('/profile', 
              {state: {id: friend._id, user: friend}})
            }
            >
            {friend.first_name.split('')[0]}
            {friend.last_name.split('')[0]}
          </Avatar>
          <Typography variant='h5' component='h2' flexGrow={1} noWrap
            onClick={() => 
              navigate('/profile', 
              {state: {id: friend._id, user: friend}})
            }
          >
            {friend.first_name + ' ' +friend.last_name}
          </Typography>
          <Button variant='outlined' size='small' onClick={() => sendFriendRequest(friend._id, setToken, setPending, setSuggestions)}>Add</Button>
        </Card>
      )
    })
  }

  return (
    <Grid2 container spacing={2} flexDirection='column' justifyContent='center' alignItems='center'>
      <Grid2 container minHeight='300px' alignItems='center' flexDirection='column'>
        <Typography variant='h4' component='h1'>
          Friends
        </Typography>
        <Box mt={3}>
          {mapFriends()}
        </Box>
      </Grid2>
      <Grid2 container minHeight='300px' alignItems='center' flexDirection='column'>
        <Typography variant='h4' component='h1' sx={{textAlign: 'center'}}>
          Pending Requests
        </Typography>
        <Box mt={3}>
          {mapPending()}
        </Box>
      </Grid2>
      <Grid2 container minHeight='300px' alignItems='center' flexDirection='column'>
        <Typography variant='h4' component='h1' sx={{textAlign: 'center'}}>
          Suggestions
        </Typography>
          {mapSuggestions()}
      </Grid2>
    </Grid2>
  )
}

export default Friends
//getting close to getting requests to work!! Keep at it.