import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { getFriends, getPendingRequests, getSuggestions, sendFriendRequest, acceptFriend, declineFriend } from '../../api/friends';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {Chip, Avatar, Box, Button, Card, Typography, Modal} from '@mui/material';
import { useSocket } from '../../context/SocketProvider';

const Friends = ({setToken, currentUser}) => {
  const socket = useSocket();
  const navigate = useNavigate();
  const [friends, setFriends] = useState([])
  const [pending, setPending] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState()

  useEffect(() => {
    getFriends(setToken, setFriends)
    getPendingRequests(setToken, setPending)
    getSuggestions(setToken, setSuggestions)
  }, [setToken])

  const handleConfirm = (request_id) => {
    setConfirmDelete(request_id)
    setOpen(true)
  }

  const handleDelete = () => {
    setOpen(false)
    declineFriend(confirmDelete, setToken, setPending, setSuggestions, setFriends)
    setConfirmDelete(null)
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const mapFriends = () => {
    return friends.length === 0 ?
    <Typography>No current friends</Typography>
    :
    friends.map(friend => {
      console.log(friend)
      return <Chip
        key={friend.user._id}
        clickable
          avatar= {
            <Avatar
            onClick={() => navigate('/profile', {state: {id: friend.user._id, user: friend.user, request_id: friend.request_id}})}
            >
              {friend.user.first_name.split('')[0]}
              {friend.user.last_name.split('')[0]}
            </Avatar>
          } 
        label={friend.user.first_name + " " + friend.user.last_name}
        onDelete={() => handleConfirm(friend.request_id)}
        variant='outlined' 
      >
      </Chip>
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
            {friend.user.first_name + ' ' + friend.user.last_name}
          </Typography>
            {friend.type !== 'receiver' ?
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <Button variant='outlined' color="success" size='small' onClick={() => acceptFriend(friend.request_id, setToken, setPending, setFriends)}>Accept</Button>
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
          <Button variant='outlined' size='small' onClick={() => sendFriendRequest(friend._id, currentUser.id, setToken, setPending, setSuggestions, socket)}>Add</Button>
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
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            This will remove this friend are you sure you want to continue?
          </Typography>
          <Box sx={{display: 'flex', justifyContent: 'space-evenly', mt: 2}}>
            <Button 
              variant='contained' 
              color='error'
              onClick={handleDelete}  
            >
              Yes
            </Button>
            <Button 
              variant='contained'
              color='success'
              onClick={() => setOpen(false)}  
            >
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    </Grid2>
  )
}

export default Friends
//getting close to getting requests to work!! Keep at it.