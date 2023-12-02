import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Container } from '@mui/material';
import useRequest from '../hooks/use-request';
import { useDispatch } from 'react-redux';
import { setAlertInfo, setShowAlert } from '../redux/alertSlice';
import { useState } from 'react';

export const PayPalCheckout = ({ ticketId, ticketPrice, orderId }) => {
  const dispatch = useDispatch();
  const [paypalId, setPaypalId] = useState('');

  const createOrder = async () => {
    return fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price: ticketPrice,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data.id;
      });
  };
  const onApprove = async (data) => {
    // TODO: if the order is already completed, it cant be selled again!!!
    try {
      await fetch(`/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, paypalId: data.orderID }),
      });
    } catch (error) {
      console.log(error);
      return;
    }

    return fetch(`/api/payments/${data.orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(async (orderData) => {
        dispatch(
          setAlertInfo({
            severity: 'success',
            message: `Payment completed successfully by ${orderData.payer.name.given_name} paypal account`,
          })
        );
        dispatch(setShowAlert(true));
        setTimeout(() => {
          dispatch(setShowAlert(false));
        }, 3000);
      });
  };

  const onError = (err) => {
    dispatch(
      setAlertInfo({
        severity: 'error',
        message: `Error occurred`,
      })
    );
    dispatch(setShowAlert(true));
    setTimeout(() => {
      dispatch(setShowAlert(false));
    }, 3000);
  };

  return (
    <Container>
      <PayPalScriptProvider
        key={`${ticketId}`}
        options={{
          'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          currency: 'USD',
          intent: 'capture',
        }}
      >
        <PayPalButtons
          forceReRender={[ticketId]}
          // disabled={disabled || disabledButtons}
          // style={{ layout: 'vertical' }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
        />
      </PayPalScriptProvider>
    </Container>
  );
};
