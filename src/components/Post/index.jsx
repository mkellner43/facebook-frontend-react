import React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { IconButton, TextField } from '@mui/material';
import { Box } from '@mui/material';
import { sendPost } from '../../api/posts';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AddPhotoAlternateOutlined } from '@mui/icons-material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

const Post = ({setToken, setStale}) => {
  const [post, setPost] = useState();
  const [imageAvailable, setImageAvailable] = useState();
  const queryClient = useQueryClient();

  const send = useMutation({
    mutationFn: ({object, setToken}) => sendPost(object, setToken),
    onSuccess: data => {
      queryClient.setQueryData(['posts'], (oldData) => [data, ...oldData])
      queryClient.invalidateQueries(['posts'])
    }   
  })

  const handleSubmit = () => {
    if(!post) return
    const object = JSON.stringify({post_body: post, post_image: imageAvailable})
    send.mutate({object, setToken})
    setPost('')
    discardImage()
  }

  const handlePreview = async() => {
    const file = await document.querySelector('#image').files[0]
      const base64String = await toBase64(file)
      setImageAvailable(base64String)
  }

  const discardImage = () => {
   const file = document.querySelector('#image')
   file.value = ''
    setImageAvailable()
  }

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

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
      <Grid2 container alignItems='center' justifyContent='center' style={{display: imageAvailable ? 'flex' : 'none'}}>
        <Grid2 width={1}>
         {imageAvailable && <Button fullWidth size="small" onClick={discardImage}>
           remove image
         </Button>}
         <img id='preview' alt='preview of upload' src={imageAvailable} width='100%' style={{borderRadius: '15px'}}/>
        </Grid2>
      </Grid2>
      <Grid2 container>
        <Button size="small" variant='outlined' sx={{flexGrow:1}} onClick={handleSubmit}>Post</Button>
        <IconButton size="small" component="label">
          <input id='image' hidden accept='image/*' type="file" onChange={handlePreview}/>
          <AddPhotoAlternateOutlined color='primary'/>
      </IconButton>
      </Grid2>
    </Box>
  )
}

export default Post;
