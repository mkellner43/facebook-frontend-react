import React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { Box } from '@mui/material';

const Post = ({setPostData, postData}) => {
  const [post, setPost] = useState();

    const handleSubmit = () => {
      if(!post) return
      setPostData({post_body: post})
      setPost('')
    }
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
