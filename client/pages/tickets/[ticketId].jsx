import React from 'react';
import {
  TableContainer,
  Table,
  Container,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  Button,
} from '@mui/material';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketShow = ({ ticket }) => {
  const { errors, doRequest } = useRequest({
    method: 'post',
    url: '/api/orders',
    body: { ticketId: ticket.id },
    onSuccess: (data) => {
      Router.push('/orders/[orderId]', `/orders/${data.order.id}`);
    },
  });
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
        Ticket Data
      </Typography>
      <Container sx={{ width: '400px', marginTop: '50px' }}>
        <TicketTable ticket={ticket} />
        <br />
        <Button
          variant="contained"
          fullWidth
          sx={{ backgroundColor: '#198754' }}
          onClick={doRequest}
        >
          purchase
        </Button>
        {errors}
      </Container>
    </>
  );
};
TicketShow.getInitialProps = async (context, client) => {
  // has access to the request comming from browser
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data.ticket };
};
export default TicketShow;

const TicketTable = ({ ticket }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">
              <Typography variant="h6">Title</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="h6">Price</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="center">
              <Typography variant="body2">{ticket.title}</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="body2">{ticket.price}$</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
