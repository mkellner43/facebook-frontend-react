import { Modal, Typography, Box, Button } from '@mui/material';

const DeleteFriend = ({handleDelete, setOpen, open}) => {

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          This will remove this friend are you sure you want to continue?
        </Typography>
        <Box sx={{display: 'flex', justifyContent: 'space-evenly', mt: 2}}>
          <Button 
            variant='contained' 
            color='error'
            onClick={handleDelete}  
          >
            Yes
          </Button>
          <Button 
            variant='contained'
            color='success'
            onClick={() => setOpen(false)}  
          >
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default DeleteFriend
