import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Typography,
  Dialog,
  TextField,
  Button,
  IconButton,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import Router from 'next/router';
import { Delete } from '@mui/icons-material';
import useRequest from '../../hooks/use-request';
import { useDispatch } from 'react-redux';
import { setShowAlert, setAlertInfo } from '../../redux/alertSlice';

const OrdersTable = ({ orders }) => {
  const dispatch = useDispatch();
  const [delDialogOpen, setDelDialogOpen] = React.useState(false);
  const [currentOrderId, setCurrentOrderId] = React.useState('');
  const [isDel, setDel] = React.useState(false);

  const { errors, doRequest } = useRequest({
    method: 'delete',
    url: `/api/orders/${currentOrderId}`,
    onSuccess: async () => {
      setDel(true);
      dispatch(
        setAlertInfo({
          severity: 'success',
          message: 'order deleted successfully',
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 3000);
    },
  });

  const handleDeleteOrder = async () => {
    await doRequest();
  };

  return (
    <TableContainer component={Paper} sx={{ width: '600px', margin: 'auto' }}>
      <Table sx={{ backgroundColor: 'aliceblue' }}>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: '700' }}>
              Title
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: '700' }}>
              Status
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: '700' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders &&
            orders.map((order, index) => (
              <TableRow key={index} sx={{ cursor: 'pointer' }}>
                <TableCell
                  align="center"
                  onClick={() => {
                    if (!isDel && order.status !== 'Cancelled') {
                      Router.push(`https://ticketing.dev/orders/${order.id}`);
                    }
                  }}
                >
                  {order.ticket.title}
                </TableCell>
                <TableCell
                  align="center"
                  onClick={() => {
                    if (!isDel && order.status !== 'Cancelled') {
                      Router.push(`https://ticketing.dev/orders/${order.id}`);
                    }
                  }}
                >
                  {isDel ? 'Cancelled' : order.status}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => {
                      setCurrentOrderId(order.id);
                      setDelDialogOpen(true);
                    }}
                    color="#ff4545"
                  >
                    <Delete color="#ff4545 !important" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Dialog open={delDialogOpen} onClose={() => setDelDialogOpen(false)}>
        <DialogTitle className="dialog-title">Delete Order</DialogTitle>
        <DialogContent>
          <Typography>Sure to delete this order</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDeleteOrder(currentOrderId)}
            variant="contained"
          >
            Delete
          </Button>
          <Button onClick={() => setDelDialogOpen(false)}>close</Button>
        </DialogActions>
      </Dialog>
      {errors}
    </TableContainer>
  );
};

const Orders = ({ orders }) => {
  return (
    <Container>
      <Typography
        variant="h4"
        textAlign="center"
        marginTop="50px"
        color="cornflowerblue"
        marginBottom="50px"
        sx={{ textDecoration: 'underline' }}
      >
        My Orders
      </Typography>
      <OrdersTable orders={orders} />
    </Container>
  );
};

Orders.getInitialProps = async (context, client) => {
  const { data } = await client.get(`/api/orders`);
  return { orders: data.orders };
};

export default Orders;
