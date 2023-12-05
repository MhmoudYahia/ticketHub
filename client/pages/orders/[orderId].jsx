import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { PayPalCheckout } from '../../components/PaypalCheckout';

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const getTimeLeft = () => {
      const timeLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(timeLeft / 1000));
    };

    getTimeLeft();
    const timerId = setInterval(getTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return (
      <Typography
        variant="h5"
        textAlign="center"
        marginTop="50px"
        color="#1976d2"
        under
        sx={{ textDecoration: 'underline' }}
      >
        Order Expired
      </Typography>
    );
  }

  return (
    <>
      <Typography
        variant="h4"
        textAlign="center"
        marginTop="50px"
        color="cornflowerblue"
        under
        sx={{ textDecoration: 'underline' }}
      >
        Order Details
      </Typography>
      <Container sx={{ width: '500px', marginTop: '80px' }}>
        <Typography
          textAlign={'center'}
          marginBottom="40px"
          fontSize="large"
          fontWeight="600"
          color="#495057"
        >
          🛑 Time left to pay: {timeLeft} seconds
        </Typography>
        <PayPalCheckout
          orderId={order.id}
          ticketId={order.ticket.id}
          ticketPrice={order.ticket.price}
        />
      </Container>
    </>
  );
};
OrderShow.getInitialProps = async (context, client) => {
  // has access to the request comming from browser
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data.order };
};
export default OrderShow;
