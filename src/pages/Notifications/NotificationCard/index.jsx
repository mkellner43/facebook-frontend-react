import { Card, CardContent, Typography, Avatar, Box, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useState } from 'react'
import { deleteNotification } from '../../../api/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const CreateNotificationCards = ({notification, setToken}) => {
  const [read, setRead] = useState(notification.status === 'read')
  const queryClient = useQueryClient();

  const deleteQuery = useMutation({
    mutationFn: ({notification, setToken}) =>
      deleteNotification(notification, setToken),
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(['notifications'], (oldData) => 
        oldData.filter(request => request._id !== variables.notification)
      )
      queryClient.invalidateQueries(['notifications'])
    }
 })

  return (
    <Card variant="outlined" width={1} sx={{borderColor: read ? '' : 'blue', m: 1}}
    onMouseOver={() => setRead(true)}
    >
      <CardContent sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: '16px !important'}}>
        <Box sx={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
          <Avatar src={notification.requester.avatar?.image}>
            {notification.requester.first_name.split('')[0] + notification.requester.last_name.split('')[0]}
          </Avatar>
        <Typography sx={{ml: 0.5}}>
          {notification.msg}
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