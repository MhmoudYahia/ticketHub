import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Link,
  Dialog,
  TextField,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import useRequest from '../../hooks/use-request';

import {
  Edit as EditIcon,
  Instagram,
  Twitter,
  Facebook,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setAlertInfo, setShowAlert } from '../../redux/alertSlice';

const PersonalProfile = ({ currentUser }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newJobTitle, setNewJob] = useState('');
  const [photo, setPhoto] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editPassDialogOpen, setEditPassDialogOpen] = React.useState(false);
  let bodyFormData = new FormData();

  if (!currentUser)
    return (
      <Typography margin={10} textAlign="center">
        Not Authorized!
      </Typography>
    );

  useEffect(() => {
    setNewEmail(currentUser.email);
    setNewJob(currentUser.jobTitle);
    setNewName(currentUser.name);
    setNewPhone(currentUser.phone);
  }, []);

  const { errors: updateCurrentUserErrors, doRequest: doUpdateMyData } =
    useRequest({
      method: 'patch',
      url: '/api/users/update-current-user',
      body: bodyFormData,
      onSuccess: () => {
        dispatch(
          setAlertInfo({
            severity: 'success',
            message: 'Your Data has been Changed successfully 🫡',
          })
        );
        dispatch(setShowAlert(true));
        setTimeout(() => {
          dispatch(setShowAlert(false));
          router.reload();
        }, 3000);
      },
    });
  const { errors: changePasswordErrors, doRequest: doChangeMyPassword } =
    useRequest({
      method: 'patch',
      url: '/api/users/change-password',
      body: {
        currentPassword,
        newPassword,
        newPasswordConfirm: confirmNewPassword,
      },
      onSuccess: () => {
        dispatch(
          setAlertInfo({
            severity: 'success',
            message: 'Your Password has been Changed successfully 🫡',
          })
        );
        dispatch(setShowAlert(true));
        setTimeout(() => {
          dispatch(setShowAlert(false));
        }, 3000);
      },
    });

  const handleEdit = async (e) => {
    bodyFormData.append('email', newEmail);
    bodyFormData.append('name', newName);
    bodyFormData.append('phone', newPhone);
    bodyFormData.append('jobTitle', newJobTitle);
    if (photo) bodyFormData.append('photo', photo);
    try {
      await doUpdateMyData();
      if (updateCurrentUserErrors !== null) setEditDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditPassword = async (e) => {
    await doChangeMyPassword();
    if (changePasswordErrors !== null) setEditPassDialogOpen(false);
  };

  return (
    <Box
      className="vh-100"
      sx={{
        backgroundColor: '#f4f5f7',
        backgroundImage: 'url(/imgs/ticketBG.jpg)',
      }}
    >
      <Container className="py-5 h-100" >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          className="h-100"
        >
          <Grid item lg={6} className="mb-4 mb-lg-0">
            <Card sx={{ mb: 3, borderRadius: '.5rem' }}>
              <Grid container>
                <Grid
                  item
                  md={4}
                  className="gradient-custom text-center text-white"
                  sx={{
                    borderTopLeftRadius: '.5rem',
                    borderBottomLeftRadius: '.5rem',
                    display: 'flex',
                    'flex-direction': 'column',
                    'align-items': 'center',
                    flexBasis: '70%',
                  }}
                >
                  <CardMedia
                    component="img"
                    src={`${currentUser.photo}`}
                    alt="Image"
                    className="my-5"
                    sx={{
                      width: '100px',
                      borderRadius: '50%',
                      height: '100px',
                    }}
                  />
                  <Typography variant="h5">{currentUser.name}</Typography>

                  <Typography variant="body1">
                    {currentUser.jobTitle || 'Job Title'}
                  </Typography>

                  <IconButton onClick={(e) => setEditDialogOpen(true)}>
                    <EditIcon />
                  </IconButton>
                </Grid>
                <Grid item md={8}>
                  <CardContent className="p-4">
                    <Typography variant="h6">Information</Typography>
                    <hr sx={{ mt: 0, mb: 4 }} />
                    <Grid container sx={{ pt: 1 }}>
                      <Grid item xs={6} sx={{ mb: 3 }}>
                        <Typography variant="h6">Email</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {currentUser.email}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ mb: 3 }}>
                        <Typography variant="h6">Phone</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {currentUser.phone || 'xxx-xxx-xxx'}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'start' }}>
                      <Link href="#!">
                        <IconButton>
                          <Facebook color="#1976d2" />
                        </IconButton>
                      </Link>
                      <Link href="#!">
                        <IconButton>
                          <Twitter color="#1976d2" />
                        </IconButton>
                      </Link>
                      <Link href="#!">
                        <IconButton>
                          <Instagram color="#1976d2" />
                        </IconButton>
                      </Link>
                    </Box>
                  </CardContent>
                  <hr sx={{ mt: 0, mb: 4 }} />
                  <CardContent>
                    <Button onClick={(e) => setEditPassDialogOpen(true)}>
                      Change Password
                    </Button>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle className="dialog-title">Edit Personal Data</DialogTitle>
        <DialogContent>
          <IconButton sx={{ marginBottom: '10px' }}>
            <label htmlFor="photo-input">
              <AddAPhotoIcon
                sx={{
                  'font-size': '34px',
                  position: 'relative',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#1976d2',
                }}
              ></AddAPhotoIcon>
              <input
                id="photo-input"
                type="file"
                hidden
                required
                onChange={(e) => {
                  const file = e.target.files[0];
                  setPhoto(file);
                }}
              />
            </label>
          </IconButton>

          <TextField
            style={{ marginBottom: '20px' }}
            margin="dense"
            label="Email"
            type="text"
            fullWidth
            required={true}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <TextField
            style={{ marginBottom: '20px' }}
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            required={true}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <TextField
            style={{ marginBottom: '20px' }}
            margin="dense"
            label="Job Title"
            type="text"
            fullWidth
            required={true}
            value={newJobTitle}
            onChange={(e) => setNewJob(e.target.value)}
          />
          <TextField
            style={{ marginBottom: '20px' }}
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            required={true}
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />
          {updateCurrentUserErrors}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEdit} variant="contained">
            Edit
          </Button>
          <Button onClick={() => setEditDialogOpen(false)}>close</Button>
        </DialogActions>
      </Dialog>

      {/* Update password dialog */}
      <Dialog
        open={editPassDialogOpen}
        onClose={() => setEditPassDialogOpen(false)}
      >
        <DialogTitle className="dialog-title">Edit Password</DialogTitle>
        <DialogContent>
          <TextField
            style={{ marginBottom: '20px' }}
            margin="dense"
            label="Current Password"
            type="text"
            fullWidth
            required={true}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            style={{ marginBottom: '20px' }}
            margin="dense"
            label="New Password"
            type="text"
            fullWidth
            required={true}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            style={{ marginBottom: '20px' }}
            margin="dense"
            label="Confirm New Password"
            type="text"
            fullWidth
            required={true}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          {changePasswordErrors}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditPassword} variant="contained">
            Edit
          </Button>
          <Button onClick={() => setEditPassDialogOpen(false)}>close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PersonalProfile;
