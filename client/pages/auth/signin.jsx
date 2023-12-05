import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useRequest from '../../hooks/use-request';
import {
  Container,
  Grid,
  Button,
  IconButton,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Link,
  Avatar,
} from '@mui/material';
import { LockOutlined, Google } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setAlertInfo, setShowAlert } from '../../redux/alertSlice';

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { errors, doRequest } = useRequest({
    method: 'post',
    url: '/api/users/signin',
    body: { email, password },
    onSuccess: async () => {
      await router.push('/');
      dispatch(
        setAlertInfo({
          severity: 'success',
          message: 'Signed in Successfully, Welcome!😍',
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

  const signWithGoogle = async () => {
    const response = await fetch('/api/users/requestOauth-google', {
      method: 'post',
    });
    const data = await response.json();
    await router.push(data.url);
  };

  return (
    <Container maxWidth="sm" sx={{ p: 3, my: 5 }}>
      <Grid container sx={{ justifyContent: 'center', gap: '70px' }}>
        <Grid item xs={10} md={6}>
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            alt="Sample image"
            className="img-fluid"
          />
        </Grid>

        <Grid item xs={8} md={5} sx={{ ms: 2, alignItems: 'center' }}>
          <Avatar
            sx={{
              margin: 'auto',
              bgcolor: 'secondary.main',
              'background-color': '#1976d2',
            }}
          >
            <LockOutlined />
          </Avatar>
          <Typography
            component="div" // Set the component prop to a div
            variant="h5"
            style={{
              fontWeight: 600,
              color: '#1976d2',
              marginBottom: '30px',
              textAlign: 'center',
            }}
          >
            Sign In
          </Typography>
          <Typography width="100%" marginBottom="10px">
            {errors}
          </Typography>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            label="Email"
            id="form3"
            type="email"
          />

          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            label="Password"
            id="form4"
            type="password"
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 4,
              alignItems: 'center',
            }}
          >
            <FormControlLabel
              control={
                <Checkbox name="flexCheck" value="" id="flexCheckDefault" />
              }
              label="Remember me"
            />
            <Link href="#">Forgot password?</Link>
          </div>

          <div style={{ textAlign: 'center', mt: 4, pt: 2 }}>
            <Button
              onClick={onSubmit}
              variant="contained"
              size="large"
              fullWidth
            >
              Login
            </Button>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                my: 4,
                marginTop: '20px',
              }}
            >
              <Typography
                color="error"
                variant="body1"
                component="p"
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  mx: 3,
                  mb: 0,
                  fontSize: '18px',
                }}
              >
                Or
              </Typography>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body1" component="p" sx={{ mb: 0, me: 3 }}>
                Sign in with
              </Typography>

              <IconButton
                component="a"
                color="inherit"
                className=""
                sx={{ color: '#1266f1' }}
                onClick={signWithGoogle}
              >
                <Google sx={{ fontSize: '1.5rem' }} />
              </IconButton>
            </div>

            <Typography
              variant="body2"
              component="p"
              sx={{ fontWeight: 'bold', mt: 2, pt: 1, mb: 2 }}
            >
              Don't have an account?{' '}
              <Link href="https://ticketing.dev/auth/signup" color="error">
                Register
              </Link>
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignIn;
