import { Typography, Chip, Avatar } from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useNavigate } from "react-router-dom";

const MapFriends = ({friendQuery, handleConfirm}) => {
  const navigate = useNavigate();

  return friendQuery.data.length === 0 ?
    <Typography>No current friends</Typography>
  :
  friendQuery.data.map(friend => {
    return <Grid2 item key={friend.user._id} justifyContent='center' alignItems={'center'}>
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

export default MapFriends;