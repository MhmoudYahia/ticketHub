import React, { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import {
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Avatar,
  Typography,
} from '@mui/material';
import { GitHub, Facebook, LinkedIn, LockOutlined } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setAlertInfo, setShowAlert } from '../../redux/alertSlice';

const SignUp = ({}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const dispatch =  useDispatch();

  const { errors, doRequest } = useRequest({
    method: 'post',
    url: '/api/users/signup',
    body: {
      email,
      password,
      passwordConfirm,
      name: `${firstName} ${lastName}`,
    },
    onSuccess: async () => {
      await Router.push('/');
      dispatch(
        setAlertInfo({
          severity: 'success',
          message: 'Signed up Successfully, Wellcome!😍',
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 3000);
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <Container fluid className=" background-radial-gradient overflow-hidden">
      <Grid container>
        <Grid
          item
          md={6}
          className="text-center text-md-start d-flex flex-column justify-content-center"
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            className="my-5 display-3 fw-bold ls-tight px-3"
            sx={{ color: 'hsl(218, 81%, 95%)' }}
          >
            The best offer <br />
            <Typography
              component="span"
              variant="h3"
              sx={{ color: 'hsl(218, 81%, 75%)' }}
            >
              for your business
            </Typography>
          </Typography>

          <Typography
            variant="body1"
            gutterBottom
            className="px-3"
            sx={{ color: 'hsl(218, 81%, 85%)' }}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
            itaque accusantium odio, soluta, corrupti aliquam quibusdam tempora
            at cupiditate quis eum maiores libero veritatis? Dicta facilis sint
            aliquid ipsum atque?
          </Typography>
        </Grid>

        <Grid item md={6} className="position-relative">
          <div
            id="radius-shape-1"
            className="position-absolute rounded-circle shadow-5-strong"
          ></div>
          <div
            id="radius-shape-2"
            className="position-absolute shadow-5-strong"
          ></div>

          <Card className="my-5 bg-glass">
            <CardContent
              className="p-5"
              style={{
                display: 'flex',
                'flex-direction': 'column',
                'align-items': 'center',
                padding: '28px 3rem !important',
              }}
            >
              <Avatar
                sx={{
                  m: 1,
                  bgcolor: 'secondary.main',
                  'background-color': '#1976d2',
                }}
              >
                <LockOutlined />
              </Avatar>
              <Typography
                component="h1"
                variant="h5"
                style={{
                  fontWeight: 600,
                  color: '#1976d2',
                  marginBottom: '30px',
                }}
              >
                Sign Up
              </Typography>
              <Typography width="100%" marginBottom="10px">
                {errors}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    fullWidth
                    label="First name"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    fullWidth
                    label="Last name"
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                label="Email"
                variant="outlined"
              />

              <TextField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                label="Password"
                variant="outlined"
                type="password"
              />

              <TextField
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                fullWidth
                margin="normal"
                label="Password Confirm"
                variant="outlined"
                type="password"
              />

              <br />
              <Button onClick={onSubmit} variant="contained" fullWidth>
                sign up
              </Button>

              <div className="text-center" style={{ 'margin-bottom': '23px' }}>
                <Typography variant="body1" marginTop="20px" gutterBottom>
                  OR
                </Typography>

                <Button
                  component="a"
                  href="#"
                  color="inherit"
                  className=""
                  sx={{ color: '#1266f1' }}
                >
                  <GitHub sx={{ fontSize: '1.5rem' }} />
                </Button>
                <Button
                  component="a"
                  href="#"
                  color="inherit"
                  className=""
                  sx={{ color: '#1266f1' }}
                >
                  <LinkedIn sx={{ fontSize: '1.5rem' }} />
                </Button>
                <Button
                  component="b"
                  href="#"
                  color="inherit"
                  className=""
                  sx={{ color: '#1266f1' }}
                >
                  <Facebook sx={{ fontSize: '1.5rem' }} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignUp;