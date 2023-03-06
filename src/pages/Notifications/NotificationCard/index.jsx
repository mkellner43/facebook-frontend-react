import { Card, CardContent, Typography, Avatar, Box, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useState } from 'react'
import { deleteNotification } from '../../../api/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const CreateNotificationCards = ({notification, setToken, setNotifications}) => {
  const [read, setRead] = useState(notification.status === 'read')
  const queryClient = useQueryClient();

  const deleteQuery = useMutation({
    mutationFn: ({notification, setToken}) =>
      deleteNotification(notification, setToken),
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(['notifications'], (oldData) => 
      oldData.filter(request => request.request_id !== variables.request_id)
      )
      queryClient.invalidateQueries(['notifications'])
    }
 })

  return (
    <Card variant="outlined" width={1} sx={{borderColor: read ? '' : 'blue', m: 1}}
    onMouseOver={() => setRead(true)}
    >
      {console.log(notification.data.status === 'pending')}
       <CardContent sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: '16px !important'}}>
         <Box sx={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
           <Avatar>
             {notification.requester.first_name.split('')[0] + notification.requester.last_name.split('')[0]}
           </Avatar>
           <Typography sx={{ml:1}} >
             {notification.requester.username}
           </Typography>
         <Typography sx={{ml: 0.5}}>
          {notification.type === 'Friend Request' && notification.data.status === 'pending' && 'sent you a '}
          {notification.type === 'Friend Request' && notification.data.status === 'accepted' && 'accepted your '}
          {notification.type === 'Message'  && 'sent you a '}
          {notification.type.toLowerCase()}
         </Typography>
         </Box>
           <IconButton 
            onClick={() => deleteQuery.mutate({notification: notification._id, setToken: setToken})}
            >
            <ClearIcon color='error' />
           </IconButton>
       </CardContent>
     </Card>
  )
 } 