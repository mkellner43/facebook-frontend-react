import { useNavigate } from 'react-router-dom';
import { Typography, Card, Avatar, Button } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

const FriendSuggestions = ({suggestionsQuery, sendRequestQuery, currentUser, setToken}) => {
  const navigate = useNavigate();

  return (
    suggestionsQuery.data.length === 0 ?
        <Typography>No suggestions</Typography>
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
              }}>
              <Avatar
                variant='outlined'
                sx={{mr: 1}}
                onClick={() =>
                  navigate('/profile', 
                  {state: {id: friend._id, user: friend}})
                }
                src={friend.avatar?.image}
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
              <Button 
                variant='outlined' 
                size='small' 
                disabled={sendRequestQuery.isLoading} 
                onClick={() => sendRequestQuery.mutate({
                    friend: friend._id, 
                    currentUser: currentUser.id, 
                    setToken: setToken, 
                  })
                }>
                Add
              </Button>
            </Card>
          </Grid2>
        )
      })
  )
}

export default FriendSuggestions;
