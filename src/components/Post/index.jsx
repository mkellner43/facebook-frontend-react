import React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { Box } from '@mui/material';

const Post = ({setToken, setStale}) => {
  const [post, setPost] = useState();
  const [postData, setPostData] = useState();

    const handleSubmit = () => {
      if(!post) return
      setPostData({post_body: post})
      setPost('')
    }

    React.useEffect(() => {
      if(!postData) return
      fetch('http://localhost:3000/api/v1/posts', {
        method: 'post',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(postData)
      })
      .then((response) => {
        if(!response.ok) {
          document.cookie = 'access_token= ; max-age=0'
          sessionStorage.clear()
          setToken()
        }
        return response.json()})
      .then((data) => 
        console.log(data)
      )
      .catch((error) => {
        console.log(error)
      })
      setStale(prevState => !prevState)
    }, [postData, setToken, setStale])

  return (
    <Box >
      <TextField
          id="outlined-multiline-flexible"
          label="What's on your mind?"
          onChange={(e) => setPost(e.target.value)}
          value={post}
          fullWidth
          multiline
          rows={5}
      />
      <Button size="small" variant='outlined' sx={{mt: 1, width: 1}} onClick={handleSubmit}>Post</Button>
    </Box>
  )
}

export default Post;
