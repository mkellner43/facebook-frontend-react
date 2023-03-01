import { Typography, Box } from '@mui/material';
import { getNotifications } from '../../api/notifications';
import { CreateNotificationCards } from './NotificationCard';
import { useQuery } from '@tanstack/react-query';

const Notifications = ({setToken}) => {
  const notificationQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(setToken, true),
  })

  function createNotificationCards() {
    return notificationQuery.isSuccess &&
     notificationQuery.data.length > 0 ?
     notificationQuery.data
     .map(notification => 
     <CreateNotificationCards key={notification._id} notification={notification} setToken={setToken} />)
      :
      <Typography textAlign={'center'}>
        No new notifications
      </Typography>;
  } 
  return (
    <>
      <h1 style={{textAlign: 'center'}}>Notifications</h1>
      <Box sx={{display: 'flex', width: 1, justifyContent: 'center'}}>
        <Box sx={{maxWidth: '450px', width: 1}}>
          {createNotificationCards()}
        </Box>
      </Box>
    </>
  )
}

export default Notifications;
