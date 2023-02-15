import './style.scss';
import React from 'react';
import { useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { parseISO } from 'date-fns/esm';
import { 
  TextField, Button, Box, Chip, Avatar, Divider,
  Badge, Modal, Card, CardActions, CardContent,
  Typography, IconButton
} from '@mui/material';

const Cards = ({post, comments, date, user, variant='outlined', object, setToken, currentUser, setStale}) => {
  const UsFormatter = new Intl.DateTimeFormat('en-US');
  const navigate = useNavigate()
  const [likes, setLikes] = useState(object.likes.filter(like => like._id === currentUser.id).length > 0);
  const [sendLike, setSendLike] = useState();
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState();
  const [sendComment, setSendComment] = useState(false);
  const [commentsVisable, setCommentsVisable] = useState(false);
  const [confirmedDelete, setConfirmedDelete] = useState(false);
  const [module, setModule] = useState(false);

  const handleLike = () => {
    setLikes(prevState => !prevState)
    setSendLike(true)
  }

  const submitComment = () => {
    if(comment?.trim().split('').length > 0) {
      setSendComment(JSON.stringify({comment_body: comment}))
      setComment('')
    } 
  }

  const handleDelete = () => {
    setModule(true)
  }
  
  const deleteConfirmed = () => {
    setConfirmedDelete(true)
    setModule(false)
  }

  useEffect(() => {
    if(!sendLike) return
    fetch(`http://localhost:3000/api/v1/posts/like/${object._id}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
    })
    .then(res => {
      if(!res.ok) {
        document.cookie = 'access_token= ; max-age=0'
        sessionStorage.clear()
        setToken()
      } 
      else return res.json()
    })
    .then(data => console.log(data))
    .catch(err => {
      console.error(err)
    })
    setSendLike(false)
  }, [sendLike])

  useEffect(() => {
    if(!sendComment) return
    fetch(`http://localhost:3000/api/v1/comments/${object._id}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: sendComment
    })
    .then(res => {
      if(!res.ok) {
        document.cookie = 'access_token= ; max-age=0'
        sessionStorage.clear()
        setToken()
      } 
      else {
        setStale(prevState => !prevState)
        return res.json()
      }
    })
    .then(data => console.log(data))
    .catch(err => {
      console.error(err)
    })
    setStale(prevState => !prevState)
    setSendComment(false)
  }, [sendComment])

  useEffect(() => {
    if(!confirmedDelete) return
    fetch(`http://localhost:3000/api/v1/posts/${object._id}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
    })
    .then(res => {
      if(!res.ok) {
        document.cookie = 'access_token= ; max-age=0'
        sessionStorage.clear()
        setToken()
      } 
      else {
        setStale(prevState => !prevState)
        return res.json()
      }
    })
    .then(data => console.log(data))
    .catch(err => {
      console.error(err)
    })
    setConfirmedDelete(false)
  }, [confirmedDelete])

  const post_comments = comments.map(comment => 
      <Box sx={{m: 2}} key={comment._id}>
        <Box sx={{mb: 2}}>
          <Chip 
            avatar=
            {
              <Avatar>
                {comment.user.first_name.split('')[0]}
                {comment.user.last_name.split('')[0]}
              </Avatar>
            } 
            label={comment.user.first_name + " " + comment.user.last_name} 
            variant='outlined' 
            />
        </Box>
        <Box sx={{ml: 2}}>
          <Chip label={comment.comment_body} color="primary"></Chip>
        </Box>
        <Box sx={{ml: 3}}>
          <Typography color="text.secondary" variant='caption' noWrap>
            {UsFormatter.format(parseISO(comment.date))}
          </Typography>
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
    <Card variant={variant} sx={{width: 1}}>
      <CardContent >
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Box sx={{display: 'flex', alignItems: 'center'}} onClick={() => navigate('/profile', {state: {id: object.user._id, user: object.user}})}>
            <Avatar sx={{width: '3rem', height: '3rem', mr: 2}} alt={''}>{currentUser.first_name.split('')[0]}{currentUser.last_name.split('')[0]}</Avatar>
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
  )
}

export default Cards;
