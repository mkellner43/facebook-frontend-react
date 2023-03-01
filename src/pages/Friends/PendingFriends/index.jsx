import { useNavigate } from "react-router-dom";
import { Typography, Card, Avatar, Box, Button, Chip } from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

const PendingFriends = ({pendingQuery, acceptQuery, declineQuery, setToken}) => {
  const navigate = useNavigate();
  return (
    pendingQuery.data.length === 0 ?
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
  )
}

export default PendingFriends;
