import React, {useState} from 'react';
import { getFriends, getPendingRequests, getSuggestions, sendFriendRequest, acceptFriend, declineFriend } from '../../api/friends';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {Typography} from '@mui/material';
// import { useSocket } from '../../context/SocketProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DeleteFriend from '../../components/Modals/DeleteFriend';
import MapFriends from './FriendsContainer';
import PendingFriends from './PendingFriends';
import FriendSuggestions from './FriendSuggestions';

const Friends = ({setToken, currentUser}) => {
  // const socket = useSocket();
  const queryClient = useQueryClient();
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
    mutationFn: ({friend, currentUser, setToken}) =>
      sendFriendRequest(friend, currentUser, setToken),
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

  return (
    <Grid2 container spacing={2} justifyContent="space-evenly">
      <Grid2 container flexDirection='column' alignItems='center'>
        <Typography variant='h4' component='h1'>
          Friends
        </Typography>
        <Grid2 container m={1} spacing={1} width={'30vw'} minWidth={300} maxHeight="80vh" alignItems='center' flexDirection='column' overflow={'scroll'} flexWrap={'nowrap'}>
          {friendQuery.isSuccess && <MapFriends friendQuery={friendQuery} handleConfirm={handleConfirm}/>}
        </Grid2>
      </Grid2>
      <Grid2 container flexDirection='column' alignItems='center'>
        <Typography variant='h4' component='h1'>
          Pending Requests
        </Typography>
        <Grid2 container m={1} width={'30vw'} minWidth={300} maxHeight="80vh" alignItems='center' flexDirection='column' overflow={'scroll'} flexWrap={'nowrap'}>
          { pendingQuery.isSuccess && <PendingFriends pendingQuery={pendingQuery} acceptQuery={acceptQuery} declineQuery={declineQuery} setToken={setToken} /> }
        </Grid2>
      </Grid2>
      <Grid2 container flexDirection='column' alignItems='center'>
        <Typography variant='h4' component='h1'>
          Suggestions
        </Typography>
        <Grid2 container m={1} width={'30vw'} minWidth={300} maxHeight="80vh" alignItems='center' flexDirection='column' overflow={'scroll'} flexWrap={'nowrap'}>
          { suggestionsQuery.isSuccess && <FriendSuggestions suggestionsQuery={suggestionsQuery} sendRequestQuery={sendRequestQuery} currentUser={currentUser} setToken={setToken}/> }
        </Grid2>
      </Grid2>
      <DeleteFriend handleDelete={handleDelete} setOpen={setOpen} open={open} />
    </Grid2>
  )
}

export default Friends;