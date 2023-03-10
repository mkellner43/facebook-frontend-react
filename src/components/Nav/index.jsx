import React, {useEffect, useState} from 'react';
import { getNotifications } from '../../api/notifications';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useSocket } from '../../context/SocketProvider';
import { styled, useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Avatar, Badge, Tooltip, Snackbar, Alert } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import FeedIcon from '@mui/icons-material/Feed';
import MessageIcon from '@mui/icons-material/Message';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import NotificationsIcon from '@mui/icons-material/Notifications';


const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft({setToken, currentUser}) {
  const theme = useTheme();
  const socket = useSocket();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notificationMsg, setNotificationMsg] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    socket?.on('notification', (data) => {
      setNotificationMsg(data)
      setNotificationOpen(true)
    })
    return () => {
      socket?.off('notification')
    };
  }, [socket])

  const notificationQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(setToken)
  })

  const handleDrawerOpen = () => {
    queryClient.invalidateQueries(['notifications'])
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    document.cookie = 'access_token= ; max-age=0'
    sessionStorage.clear()
    navigate('/login')
    setToken()
  }

  const getBadgeContent = () => {
    const number = notificationQuery.data?.filter(notification => notification.status === 'unread')
    return number?.length
  }

  const handleClose = () => {
    setNotificationOpen(false)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Snackbar open={notificationOpen} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
          {notificationMsg}
        </Alert>
      </Snackbar>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{display: 'flex', width: 1, justifyContent: "flex-end"}}>
            <Link to="/" style={{textDecoration: 'none', color: 'white'}}>
              <Typography variant="h6" component="h1">
                Facebookie
              </Typography>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        anchor="left"
        role='presentation'
        open={open}
        onClose={handleDrawerClose}
      >
        <DrawerHeader>
          <Tooltip title='Profile' placement='bottom-end' arrow>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', width: 1, p: 2}}
             onClick={() => {
               navigate('/profile', {state: {id: currentUser.id, user: currentUser}}) 
            }}
            >
            <Avatar src={currentUser.avatar?.image} sx={{width: '3rem', height: '3rem'}} alt={''}>{currentUser.first_name.split('')[0]}{currentUser.last_name.split('')[0]}</Avatar>
              <Typography>{currentUser.username}</Typography>
            </Box>
          </Tooltip>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/')}>
              <ListItemIcon>
                <FeedIcon />
              </ListItemIcon>
              <ListItemText primary='Feed' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/messages')}>
              <ListItemIcon>
                <MessageIcon />
              </ListItemIcon>
              <ListItemText primary='Messages' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/friends')}>
              <ListItemIcon>
                <PeopleAltIcon />
              </ListItemIcon>
              <ListItemText primary='Friends' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/notifications')}>
              <ListItemIcon>
                <Badge color='primary' badgeContent={getBadgeContent()}>
                  <NotificationsIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText primary='Notifications' />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List >
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={'Log Out'}/>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}