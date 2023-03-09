import { Typography, Avatar, Card, Button } from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useNavigate } from "react-router-dom";

const MapFriends = ({friendQuery, handleConfirm}) => {
  const navigate = useNavigate();

  return friendQuery.data.length === 0 ?
    <Typography>No current friends</Typography>
  :
  friendQuery.data.map(friend => {
    return (
      <Grid2 key={friend.request_id} xs={12}>
        <Card variant="outlined" sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2}}>
          <Avatar
            variant='outlined'
            sx={{mr: 1}}
            onClick={() => navigate('/profile', {state: {id: friend.user._id, user: friend.user}})}
            src={friend.user.avatar?.image}
            >
            {friend.user.first_name.split('')[0]}
            {friend.user.last_name.split('')[0]}
          </Avatar>
          <Typography variant='h5' component='h2' flexGrow={1} noWrap
          onClick={() => navigate('/profile', {state: {id: friend.user._id, user: friend.user}})}
          >
            {friend.user.first_name + ' ' + friend.user.last_name}
          </Typography>
          <Button
          color="error"
          onClick={() => handleConfirm(friend.request_id)}
          >
            Remove Friend
          </Button>
        </Card>
      </Grid2>
      )
    })
  }

export default MapFriends;