import React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { Box } from '@mui/material';
import { sendPost } from '../../api/posts';

const Post = ({setToken, setStale}) => {
  const [post, setPost] = useState();

    const handleSubmit = () => {
      if(!post) return
      const object = {post_body: post}
      sendPost(object, setToken, setStale)
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
