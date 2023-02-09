import React from 'react'
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { Box } from '@mui/material';

const Post = () => {
  function handleSubmit(e) {
    console.log('hi')
      fetch('http://localhost:3000/blogs', {
        method: 'post',
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      })
      .then((response) => response.json())
      .then((data) => 
       console.log(data)
      )
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <Box >
      <TextField
          id="outlined-multiline-flexible"
          label="What's on your mind?"
          fullWidth
          multiline
          rows={5}
      />
      <Button size="small" variant='outlined' sx={{mt: 1, width: 1}} onClick={handleSubmit}>Post</Button>
    </Box>
  )
}

export default Post;
