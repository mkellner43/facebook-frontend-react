import { Card, CardContent, Typography, Avatar, Box, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useState, useEffect } from 'react'
import { getNotifications, readAllNotifications, deleteNotification } from '../../api/notifications';

const CreateNotificationCards = ({notification, setToken, setNotifications}) => {
  const [read, setRead] = useState(notification.status === 'read')

  return (
    <Card variant="outlined" width={1} sx={{borderColor: read ? '' : 'blue', m: 1}}
    onMouseOver={() => setRead(true)}
    >
       <CardContent sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: '16px !important'}}>
         <Typography>
           {notification.type}
         </Typography>
         <Box sx={{display: 'flex', alignItems: 'center'}}>
           <Avatar>
             {notification.requester.first_name.split('')[0] + notification.requester.last_name.split('')[0]}
           </Avatar>
           <Typography sx={{ml:1}} >
             {notification.requester.username}
           </Typography>
           <IconButton 
            onClick={() => deleteNotification(notification._id, setToken, setNotifications)}
           >
            <ClearIcon color='error'/>
           </IconButton>
         </Box>
       </CardContent>
     </Card>
  )
 } 

const Notifications = ({setToken}) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
      getNotifications(setToken, setNotifications)
    }, [])
    
    notifications && readAllNotifications(notifications, setToken)


  function createNotificationCards() {
    return notifications?.length > 0 ?
      notifications.map(notification => <CreateNotificationCards key={notification._id} notification={notification} setToken={setToken} setNotifications={setNotifications} />
      )
      :
      <Typography textAlign={'center'}>
        No new notifications
      </Typography>;
  } 
  return (
    <>
      <h1 style={{textAlign: 'center'}}>Notifications</h1>
      <Box sx={{display: 'flex', width: 1, justifyContent: 'center'}}>
        <Box sx={{maxWidth: '500px', width: 1}}>
          {createNotificationCards()}
        </Box>
      </Box>
    </>
  )
}

export default Notifications;
