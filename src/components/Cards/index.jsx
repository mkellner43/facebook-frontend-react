import React from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Box from '@mui/material/Box';
import { parseISO } from 'date-fns/esm';


const Cards = ({post, comments, user, variant='outlined'}) => {
  const UsFormatter = new Intl.DateTimeFormat('en-US')
  return (
    <Card variant={variant} sx={{width: 1}}>
      <CardContent >
        <Typography variant="h3" fontSize='1rem' fontWeight={300} noWrap>
        {user.email}
        </Typography>
        <Typography color="text.secondary" variant='caption' sx={{ml: 1}} noWrap>
          {UsFormatter.format(parseISO(post.created_at))}
        </Typography>
        <Typography sx={{ m: 3 }} variant="body1" fontWeight={200} noWrap>
          {post.body}
        </Typography>
        <CardActions>
        <IconButton size="small">
          <ThumbUpIcon />
        </IconButton>
        <IconButton size="small">
          <ChatBubbleIcon />
        </IconButton>
        <IconButton size="small">
          <ShareRoundedIcon />
        </IconButton>
      </CardActions>
        {comments.length ? <Typography fontWeight={400} fontSize="1rem" p={1} mt={1} sx={{backgroundColor: 'grey.200'}} noWrap>Comments</Typography> : null}
          {comments.map((comment) =>
            <Box key={comment.comment.created_at} m={1} sx={{border:'1px solid rgba(0, 0, 0 ,0.12)', borderRadius:'4px', padding: '1rem', overflow: 'hidden'}} >
              <Typography variant="subtitle1" fontWeight={300} m="0" p={0} lineHeight={1.167} noWrap>
                {comment.user.email}
              </Typography>
              <Typography variant="caption" color='text.secondary' sx={{ ml: 1}} noWrap>
                  {UsFormatter.format(parseISO(comment.comment.created_at))}
              </Typography>
              <Typography variant="body2" fontWeight={200} sx={{ m: 2 }} noWrap>
                  {comment.comment.body}
              </Typography>
            </Box>
          )}
      </CardContent>
    </Card>
  )
}

export default Cards;

//tanstack query