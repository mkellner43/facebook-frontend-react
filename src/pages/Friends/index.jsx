import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { getFriends, getPendingRequests, getSuggestions, sendFriendRequest, acceptFriend, declineFriend } from '../../api/friends';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {Chip, Avatar, Box, Button, Card, Typography, Modal, Grid} from '@mui/material';
import { useSocket } from '../../context/SocketProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const Friends = ({setToken, currentUser}) => {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState()

   const friendQuery = useQuery({queryKey: ['friends'], queryFn: () => getFriends(setToken)})
   const pendingQuery = useQuery({queryKey: ['pending'], queryFn: () => getPendingRequests(setToken)})
   const suggestionsQuery = useQuery({queryKey: ['suggestions'], queryFn: () => getSuggestions(setToken)})

   const declineQuery = useMutation({
      mutationFn: ({request_id, setToken}) =>
        declineFriend(request_id, setToken),
      onSuccess: (data, variables, context) => {
        queryClient.setQueryData(['friends'], (oldData) => 
        oldData.filter(request => request.request_id !== variables.request_id)
        )
        queryClient.setQueryData(['pending'], (oldData) => 
        oldData.filter(request => request.request_id !== variables.request_id)
        )
        queryClient.invalidateQueries(['suggestions'])
      }
   })

   const acceptQuery = useMutation({
    mutationFn: ({request_id, setToken}) => 
      acceptFriend(request_id, setToken),
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(['pending'], (oldData) => 
      oldData.filter(request => request.request_id !== variables.request_id)
      )
      queryClient.invalidateQueries(['friends'])
      queryClient.invalidateQueries(['pending'])
      queryClient.invalidateQueries(['suggestions'])
    }
 })

 const sendRequestQuery = useMutation({
  mutationFn: ({friend, currentUser, setToken, socket}) =>
    sendFriendRequest(friend, currentUser, setToken, socket),
  onSuccess: () => {
    queryClient.invalidateQueries(['friends'])
    queryClient.invalidateQueries(['pending'])
    queryClient.invalidateQueries(['suggestions'])
  }
 })

  const handleConfirm = (request_id) => {
    setConfirmDelete(request_id)
    setOpen(true)
  }

  const handleDelete = () => {
    setOpen(false)
    declineQuery.mutate({request_id: confirmDelete, setToken: setToken})
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
    return friendQuery.data.length === 0 ?
    <Typography>No current friends</Typography>
    :
    friendQuery.data.map(friend => {
      return <Grid2 item key={friend.user._id} xs={12}>
      <Chip
        clickable
        onClick={() => navigate('/profile', {state: {id: friend.user._id, user: friend.user, request_id: friend.request_id}})}
          avatar= {
            <Avatar>
              {friend.user.first_name.split('')[0]}
              {friend.user.last_name.split('')[0]}
            </Avatar>
          } 
        label={friend.user.first_name + " " + friend.user.last_name}
        onDelete={() => handleConfirm(friend.request_id)}
        variant='outlined' 
      >
      </Chip>
      </Grid2>
    })
  }
  const mapPending = () => {
    return pendingQuery.data.length === 0 ?
    <Typography>No pending friend requests</Typography>
    :
    pendingQuery.data.map(friend => {
      return (
        <Grid2 key={friend.request_id} xs={12}>
          <Card variant="outlined" sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2}}>
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
                <Button variant='outlined' color="success" size='small' onClick={() => acceptQuery.mutate({request_id: friend.request_id, setToken: setToken})}>Accept</Button>
                <Button variant='outlined' color="error" size='small' sx={{mt: 1}} onClick={() => declineQuery.mutate({request_id: friend.request_id, setToken: setToken})}>Decline</Button>
              </Box>
              :
              <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Chip color='warning' variant='filled'label='PENDING...' />
              </Box>
              }
          </Card>
        </Grid2>
      )
    })
  }

  const mapSuggestions = () => {
    return suggestionsQuery.data.length === 0 ?
    <Grid2 xs={12}>
      <Typography>No suggestions</Typography>
    </Grid2>
    :
    suggestionsQuery.data.map(friend => {
      return(
        <Grid2 item key={friend._id} xs={12} > 
          <Card 
            variant="outlined"
            sx={{
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center', 
              p: 2
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
            <Button variant='outlined' size='small' disabled={sendRequestQuery.isLoading} onClick={() => sendRequestQuery.mutate({friend: friend._id, currentUser: currentUser.id, setToken: setToken, socket: socket})}>Add</Button>
          </Card>
        </Grid2>
      )
    })
  }

  return (
    <Grid2 container spacing={2} justifyContent="space-evenly">
      <Grid2 container flexDirection='column' alignItems='center'>
        <Typography variant='h4' component='h1'>
          Friends
        </Typography>
        <Grid2 container m={1} spacing={1} width={'30vw'} minWidth={300} alignItems='center' flexDirection='column' overflow={'scroll'} flexWrap={'nowrap'}>
          {friendQuery.isSuccess && mapFriends()}
        </Grid2>
      </Grid2>
      <Grid2 container flexDirection='column' justifyContent='center' alignItems='center'>
        <Typography variant='h4' component='h1'>
          Pending Requests
        </Typography>
        <Grid2 container m={1} width={'30vw'} minWidth={300} alignItems='center' flexDirection='column' overflow={'scroll'} flexWrap={'nowrap'}>
          { pendingQuery.isSuccess && mapPending() }
        </Grid2>
      </Grid2>
      <Grid2 container flexDirection='column' alignItems='center'>
        <Typography variant='h4' component='h1'>
          Suggestions
        </Typography>
        <Grid2 container m={1} width={'30vw'} minWidth={300} alignItems='center' flexDirection='column' overflow={'scroll'} flexWrap={'nowrap'}>
          { suggestionsQuery.isSuccess && mapSuggestions() }
        </Grid2>
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