import './style.scss';
import React from 'react';
import { useState } from 'react';
import {postLike, postComment, deletePost} from '../../api/posts';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { parseISO } from 'date-fns/esm';
import { 
  TextField, Button, Box, Chip, Avatar, Divider,
  Badge, Modal, Card, CardActions, CardContent,
  Typography, IconButton
} from '@mui/material';
import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useSocket } from '../../context/SocketProvider';



const Cards = ({post, comments, date, user, variant='outlined', avatar, object, setToken, currentUser}) => {
  const UsFormatter = new Intl.DateTimeFormat('en-US');
  const navigate = useNavigate();
  const [likes, setLikes] = useState(object.likes.filter(like => like._id === currentUser.id).length > 0);
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState();
  const [commentsVisable, setCommentsVisable] = useState(false);
  const [module, setModule] = useState(false);
  const queryClient = useQueryClient();
  const socket = useSocket();
  
  const deleteThisPost = useMutation({
    mutationFn: deletePost,
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(['posts'], (oldData) => {
        return oldData.filter(post => post._id !== variables)
      })
      queryClient.invalidateQueries(['posts'])
    }
  })

  const addComment = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
    }
  })

  const addLike = useMutation({
    mutationFn: postLike,
    onSuccess: (data, variables, context) => {
      console.log(data.data.user)
      if(data.msg === 'like added'){
        socket?.emit('notification', {to_id: data.data.user, type: 'Like', msg: `${currentUser.username} liked your post!`})
      }
      queryClient.invalidateQueries(['posts'])
      console.log(variables)
      console.log(context)
    }
  })

  const handleLike = () => {
    setLikes(prevState => !prevState)
    addLike.mutate({object, setToken})
  }

  const submitComment = () => {
    if(comment?.trim().split('').length > 0) {
      addComment.mutate({object, setToken, comment})
      setComment('')
    } 
  }

  const handleDelete = () => {
    setModule(true)
  }
  
  const deleteConfirmed = () => {
    deleteThisPost.mutate(object._id, setToken)
    setModule(false)
  }

  const post_comments = comments
    .map(comment => 
      <Box sx={{m: 2}} key={comment._id}>
        <Box >
          <Chip 
            clickable
            onClick={() => navigate('/profile', {state: {id: comment.user._id, user: comment.user}})}
            avatar=
            {<Avatar src={comment.user.avatar?.image}>
              {comment.user.first_name.split('')[0]}
              {comment.user.last_name.split('')[0]}
              </Avatar>} 
            label={comment.user.first_name + " " + comment.user.last_name} 
            variant='outlined' 
          />
        </Box>
        <Box sx={{ml: 3}}>
          <Typography color="text.secondary" variant='caption' noWrap>
            {UsFormatter.format(parseISO(comment.date))}
          </Typography>
        </Box>
        <Box sx={{ml: 2}}>
          <Chip label={comment.comment_body} color="primary"></Chip>
        </Box>
      </Box>
    )

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '1rem'
  };
  
  return (
    <Grid2 xs={12}>
    <Card variant={variant} width={1}>
      <CardContent >
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Box sx={{display: 'flex', alignItems: 'center'}} onClick={() => navigate('/profile', {state: {id: object.user._id, user: object.user}})}>
            <Avatar src={avatar} sx={{width: '3rem', height: '3rem', mr: 2}} alt={''}>{object.user.first_name.split('')[0]}{object.user.last_name.split('')[0]}</Avatar>
            <Typography variant="h3" fontSize='1rem' fontWeight={400} noWrap>
            {user}
            </Typography>
          </Box>
          <Box>
          <Typography color="text.secondary" variant='caption' sx={{ml: 1}} noWrap>
          {UsFormatter.format(parseISO(date))}
          </Typography>
          {currentUser.id === object.user._id ? 
            <IconButton size='large' onClick={handleDelete}>
              <DeleteIcon color='error'/>
            </IconButton>
            :
            null
          }
          </Box>
        </Box>
        <Typography sx={{ m: 3 }} variant="body1" fontWeight={200} noWrap>
          {post}
        </Typography>
        <Grid2 xs={12} justifyContent='center' alignItems='center'>
          {object.image && <img width='100%' alt={post} src={object.image} style={{borderRadius: '15px'}}/>}
        </Grid2>
        <CardActions>
        <IconButton size="small" onClick={handleLike}>
          <ThumbUpIcon color={likes ? 'primary' : ''}/>
        </IconButton>
          <IconButton 
            size="small" 
            onClick={() => setIsCommenting(prevState => !prevState)}
            color={isCommenting ? 'primary' : ''}
            >
            <ChatBubbleIcon />
          </IconButton>
        <Badge badgeContent={post_comments.length > 0 ? post_comments.length : null} color="primary">
          <Chip variant='' label="Show Comments" onClick={() => setCommentsVisable(prevState => !prevState)}/>
        </Badge>
      </CardActions>
      {isCommenting || (post_comments.length > 0 && commentsVisable) ? <Divider/> : null}
      {isCommenting ? 
        <Box>
          <TextField
            id="outlined-multiline-flexible"
            label="Comment"
            multiline
            maxRows={4}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            size='small'
            />
          <Button variant="contained" size='small' sx={{mt: 1}} onClick={submitComment}>Comment</Button>
        </Box>
        :
        null
      }
      {commentsVisable ? post_comments : null}
      </CardContent>
      <Modal
        open={module}
        onClose={() => setModule(false)}
        >
        <Box sx={style}>
          <Typography variant="h6" component="h2" textAlign={'center'}>
            Permanently delete this post?
          </Typography>
          <Box sx={{display: 'flex', justifyContent: 'space-evenly', mt: 1}}>
            <Button variant="contained" onClick={deleteConfirmed}>Yes</Button>
            <Button variant="contained" onClick={() => setModule(false)}>No</Button>
          </Box>
        </Box>
      </Modal>
    </Card>
    </Grid2>
  )
}

export default Cards;
