import React, {useState, useEffect} from 'react';
import Post from '../../components/Post';
import Cards from '../../components/Cards';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Avatar, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

const Profile = ({currentUser, setToken, setStale, stale}) => {
  const [profileData, setProfileData] = useState();
  const location = useLocation()

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/posts/profile/${location.state.id}`, {
      method: 'get',
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include'
    })
    .then((response) => {
      if(!response.ok) {
        document.cookie = 'access_token= ; max-age=0'
        sessionStorage.clear()
        setToken()
        return
      }
      else return response.json()
    })
    .then(data => {
      if(data){
        setProfileData(data)
        console.log(data)
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }, [setToken, stale, location.state.id])

  return (
    <Grid2 container mt={2} >
    <Grid2 container item xs={3} justifyContent="center">
      <Avatar sx={{width: '5rem', height: '5rem'}} alt={''}>{location.state.user.first_name.split('')[0]}{location.state.user.last_name.split('')[0]}</Avatar>
    </Grid2>
    {console.log(location.state)}
    <Grid2 container item xs={9} rowSpacing={2} direction="column">
      {currentUser.id === location.state.id &&
      <Grid2 item  xs={9}>
        <Post setStale={setStale} setToken={setToken}/>
      </Grid2>
      }
      <Grid2 item  xs={9}>
        {
          profileData?.length === 0 && 
          <Typography variant='h5' component='h1' textAlign='center' sx={{mt: 3}}>No Posts Yet...</Typography>
        }
      </Grid2>
      {profileData?.map((object => {
        return( 
          <Grid2 item key={object._id} xs={9}>  
            <Cards 
              post={object.post_body}
              comments={object.comments}
              user={object.user.username}
              date={object.date}
              object={object}
              variant={'outlined'}
              setToken={setToken}
              currentUser={currentUser}
              setStale={setStale}
              />
          </Grid2>
        )
      }))}
    </Grid2>
  </Grid2>
  )
}

export default Profile;