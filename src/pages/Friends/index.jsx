import React, {useEffect, useState} from 'react';
import { Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {Chip, Avatar} from '@mui/material';

const Friends = ({setToken}) => {
  const [friends, setFriends] = useState()

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/friend_requests/friends`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
      credentials: 'include'
    })
    .then((res) => {
      if(!res.ok) {
        document.cookie = 'access_token= ; max-age=0'
        sessionStorage.clear()
        setToken()
        return
      }
      return res.json()
    })
    .then((data) => { 
      if(data) {
        setFriends(data)
      } 
    })
    .catch((err) => {
      console.error("Error:", err)
    })
  }, [])

  const mapFriends = () => {
    return friends[0] === 'No current friends' ?
    friends
    :
    friends.map(friend => {
      return <>
        <Chip 
          avatar=
          {
            <Avatar>
              {friend.user.first_name.split('')[0]}
              {friend.user.last_name.split('')[0]}
            </Avatar>
          } 
          label={friend.user.first_name + " " + friend.user.last_name} 
          variant='outlined' 
        />
      </>
    })
  }
  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={12} minHeight='300px'>
        <Typography variant='h4' component='h1' sx={{textAlign: 'center'}}>
          Friends
        </Typography>
      </Grid2>
      <Grid2 xs={12} minHeight='300px'>
        <Typography variant='h4' component='h1' sx={{textAlign: 'center'}}>
          Pending Requests
        </Typography>
      </Grid2>
      <Grid2 xs={12} minHeight='300px'>
        <Typography variant='h4' component='h1' sx={{textAlign: 'center'}}>
          Suggestions
        </Typography>
      </Grid2>
    </Grid2>
  )
}

export default Friends
//finish friend page probs work on suggestions so you can create requests with UI