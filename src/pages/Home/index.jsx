import './style.scss';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Cards from '../../components/Cards';
import Post from '../../components/Post';
import Grid2 from '@mui/material/Unstable_Grid2';

const Home = ({currentUser, setToken, setStale, stale}) => {
  const [apiData, setApiData] = React.useState(null);

  React.useEffect(() => {
    fetch('http://localhost:3000/api/v1/posts', {
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
      if(data.length > 0){
        setApiData(data)
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }, [setToken, stale])

  return (
    <Grid2 container mt={2} >
      <Grid2 container item xs={3} justifyContent="center">
        <Avatar sx={{width: '5rem', height: '5rem'}} alt={''}>{currentUser.first_name.split('')[0]}{currentUser.last_name.split('')[0]}</Avatar>
      </Grid2>
      <Grid2 container item xs={9} rowSpacing={2} direction='column'>
        <Grid2 item  xs={9}>
          <Post setStale={setStale} setToken={setToken}/>
        </Grid2>
        {apiData?.map((object => {
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

export default Home;
