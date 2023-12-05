import { Button, Container, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import { setAlertInfo, setShowAlert } from '../../redux/alertSlice';
import { useDispatch } from 'react-redux';
import Router from 'next/router';

const NewTicket = ({ currentUser }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const dispatch = useDispatch();

  const { errors, doRequest } = useRequest({
    method: 'post',
    url: '/api/tickets',
    body: { title, price },
    onSuccess: async () => {
      // await Router.push('/');
      dispatch(
        setAlertInfo({
          severity: 'success',
          message: 'ticket created successfully',
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
    console.log(errors);
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) return;

    setPrice(value.toFixed(2));
  };
  return (
    <Container>
      <Typography
        variant="h4"
        textAlign="center"
        marginTop="50px"
        color="#1976d2"
        under
        sx={{ textDecoration: 'underline' }}
      >
        Create a Ticket
      </Typography>
      <form style={{ maxWidth: '500px', margin: 'auto' }}>
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          label="Title"
          id="form3"
          type="text"
        />

        <TextField
          value={price}
          onBlur={onBlur}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          margin="normal"
          label="Price"
          id="form4"
          type="number"
        />
        <Button
          onClick={onSubmit}
          variant="contained"
          fullWidth
          sx={{ marginTop: '20px' }}
        >
          Create
        </Button>
        <Typography component='div' width="100%" marginBottom="10px" marginTop="50px">
          {errors}
        </Typography>
      </form>
    </Container>
  );
};

export default NewTicket;
