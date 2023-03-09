import React, {useState} from 'react';
import Post from '../../components/Post';
import Cards from '../../components/Cards';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Avatar, Typography, Button, Modal, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { profile } from '../../api/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AvatarEdit from 'react-avatar-edit';
import { updateAvatar } from '../../api/user';

const Profile = ({currentUser, setToken, setCurrentUser}) => {
  const location = useLocation();
  const [avatarModule, setAvatarModule] = useState(false);
  const [selectedImage, setSelectedImage] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  location.state === null && navigate('/')

  const getProfileData = useQuery({
    queryKey: ['profile'],
    queryFn: () => profile(location.state.id, setToken),
  })

  const updateAvatarQuery = useMutation({
    mutationFn: ({selectedImage, setToken}) => updateAvatar(selectedImage, setToken, setCurrentUser),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile'])
    },
    onError: (err) => console.log(err)
  })
  const style = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const onCrop = view => {
    setSelectedImage(view)
  }

  const discardImage = () => {
    setSelectedImage(false)
  }

  const handleClose = () => {
    setAvatarModule(false)
    setSelectedImage(false)
  }

  const handleSave = () => {
    updateAvatarQuery.mutate({selectedImage, setToken})
    handleClose()
  }

  return (
    <Grid2 container spacing={3} sx={{flexDirection: {xs: 'column', sm:'row', lg: 'column'}, justifyContent: {xs: 'space-evenly', sm:'center'}, alignItems: {xs: 'center', sm: 'flex-start', lg: 'center'}}}>
    <Grid2 container item xs={12} sm={2} lg={12} sx={{justifyContent: {xs: "center", sm: 'flex-start'}, alignItems: {xs: 'center', sm: 'center'}}} flexDirection={'column'}>
      <Avatar src={getProfileData.data?.user.avatar?.image} sx={{width: '5rem', height: '5rem'}} alt={''}>{getProfileData.data?.user.first_name.split('')[0]}{getProfileData.data?.user.last_name.split('')[0]}</Avatar>
      <Typography>{getProfileData.data?.user.username}</Typography>
      <Button variant='contained' size='small' component='label' onClick={() => setAvatarModule(true)}>
        update avatar
      </Button>
      <Modal
        open={avatarModule}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box>
            <AvatarEdit
              width={300}
              height={300}
              onCrop={onCrop}
              onClose={discardImage}
            />
          </Box>
            <Button width={1} sx={{mt: 3}} onClick={handleSave}>
              Save
            </Button>
        </Box>
      </Modal>
    </Grid2>
    <Grid2 container item xs={11} sm={9} lg={7} rowSpacing={2} direction='column'>
      {currentUser?.id === location.state?.id &&
        <Grid2 item>
          <Post setToken={setToken}/>
        </Grid2>
      }
      {getProfileData.isLoading && <Typography>Loading...</Typography>}
      {getProfileData.isSuccess && 
      <>
        {
          getProfileData.data.length === 0 && 
          <Grid2 >
            <Typography variant='h5' component='h1' textAlign='center' sx={{mt: 3}}>No Posts Yet...</Typography>
          </Grid2>
        }
        {getProfileData.data.posts
          .map((object => {
            return <Grid2 container key={object._id}>  
              <Cards 
                post={object.post_body}
                comments={object.comments}
                user={object.user.username}
                date={object.date}
                avatar={object.user.avatar?.image}
                object={object}
                variant={'outlined'}
                setToken={setToken}
                currentUser={currentUser}
                />
            </Grid2>
          }))
        }
      </>
      }
    </Grid2>
  </Grid2>
  )
}

export default Profile;