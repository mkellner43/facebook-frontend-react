import './style.scss';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Cards from '../../components/Cards';
import Post from '../../components/Post';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Typography } from '@mui/material';
import { getPosts } from '../../api/posts';
import {
  useQuery,
} from '@tanstack/react-query';

const Home = ({currentUser, setToken}) => {

  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    onError: setToken
  })

  return (
    <Grid2 container spacing={3} sx={{flexDirection: {xs: 'column', sm:'row', lg: 'column'}, justifyContent: {xs: 'space-evenly', sm:'center'}, alignItems: {xs: 'center', sm: 'flex-start', lg: 'center'}}}>
      <Grid2 container item xs={12} sm={2} lg={12} sx={{justifyContent: {xs: "center", sm: 'flex-start'}, alignItems: {xs: 'center', sm: 'center'}}} flexDirection={'column'}>
        <Avatar sx={{width: '5rem', height: '5rem'}} alt={''}>{currentUser.first_name.split('')[0]}{currentUser.last_name.split('')[0]}</Avatar>
        <Typography>{currentUser.username}</Typography>
      </Grid2>
      <Grid2 container item xs={11} sm={9} lg={7} rowSpacing={2} direction='column'>
        <Grid2 item>
          <Post setToken={setToken}/>
        </Grid2>
        {postsQuery.isLoading && <Typography>Loading...</Typography>}
        {postsQuery.isSuccess && 
          postsQuery.data.map((object => {
            return( 
              <Grid2 item key={object._id} >  
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
            )
          }))
        }
      </Grid2>
    </Grid2>
  )
}

export default Home;
