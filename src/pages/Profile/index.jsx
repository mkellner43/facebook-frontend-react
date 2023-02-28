import Post from '../../components/Post';
import Cards from '../../components/Cards';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Avatar, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { profile } from '../../api/user';
import { useQuery } from '@tanstack/react-query';

const Profile = ({currentUser, setToken}) => {
  const location = useLocation()

  const getProfileData = useQuery({
    queryKey: ['profile'],
    queryFn: () => profile(location.state.id, setToken),
  })

  return (
    <Grid2 container spacing={3} sx={{flexDirection: {xs: 'column', sm:'row', lg: 'column'}, justifyContent: {xs: 'space-evenly', sm:'center'}, alignItems: {xs: 'center', sm: 'flex-start', lg: 'center'}}}>
    <Grid2 container item xs={12} sm={2} lg={12} sx={{justifyContent: {xs: "center", sm: 'flex-start'}, alignItems: {xs: 'center', sm: 'center'}}} flexDirection={'column'}>
      <Avatar sx={{width: '5rem', height: '5rem'}} alt={''}>{location.state.user.first_name.split('')[0]}{location.state.user.last_name.split('')[0]}</Avatar>
      <Typography>{location.state.user.username}</Typography>
    </Grid2>
    <Grid2 container item xs={11} sm={9} lg={7} rowSpacing={2} direction='column'>
      {currentUser.id === location.state.id &&
        <Grid2 item>
          <Post setToken={setToken}/>
        </Grid2>
      }
      {getProfileData.isLoading && <Typography>Loading...</Typography>}
      {getProfileData.isSuccess && 
        <>
          <Grid2 item>
            {
              getProfileData.data.length === 0 && 
              <Typography variant='h5' component='h1' textAlign='center' sx={{mt: 3}}>No Posts Yet...</Typography>
            }
          </Grid2>
          { getProfileData.data
            .map((object => {
              return <Grid2 item key={object._id}>  
                <Cards 
                  post={object.post_body}
                  comments={object.comments}
                  user={object.user.username}
                  date={object.date}
                  object={object}
                  variant={'outlined'}
                  setToken={setToken}
                  currentUser={currentUser}
                  />
              </Grid2>
            }))
          }
        </>
      }
    </Grid2>
  </Grid2>
  )
}

export default Profile;