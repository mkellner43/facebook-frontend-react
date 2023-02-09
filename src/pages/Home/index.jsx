import './style.scss';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Cards from '../../components/Cards';
import Post from '../../components/Post';
import Grid2 from '@mui/material/Unstable_Grid2';

const Home = ({currentUser}) => {
  let [data, setApiData] = React.useState(null);

  React.useEffect(() => {
    fetch('http://localhost:3000/api/v1/posts', {
      method: 'get',
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((data) => {
      if(data.length > 0){
        setApiData(data)
        return console.log(data)
      }
    }
    )
    .catch((error) => {
      console.log(error)
    })
  }, [])

  return (
      <Grid2 container mt={2} >
        <Grid2 container item xs={3} justifyContent="center">
        <Tooltip title="Home">
            <Avatar sx={{width: '5rem', height: '5rem'}} alt={currentUser.name}>{currentUser.name.split('')[0]}</Avatar>
        </Tooltip>
        </Grid2>
      <Grid2 container item xs={9} rowSpacing={2}>
        <Grid2 item  xs={9}>
          <Post />
        </Grid2>
        {data?.map((object => {
          return( 
            <Grid2 item key={object._id} xs={9}>  
              <Cards 
                post={object.blog_post}
                comments={object.comments}
                user={object.user}
                object={object} 
                variant={'outlined'}
                />
            </Grid2>
          )
        }))}
        </Grid2>
      </Grid2>
  )
}

export default Home;
