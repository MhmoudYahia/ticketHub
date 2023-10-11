import { useEffect } from 'react';
import useRequst from '../../hooks/use-request';
import Router from 'next/router';
import { Alert } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setAlertInfo, setShowAlert } from '../../redux/alertSlice';

const SignOut = ({}) => {
  const dispatch = useDispatch();
  const { doRequest } = useRequst({
    method: 'post',
    url: '/api/users/signout',
    body: {},
    onSuccess: async () => {
      await Router.push('/');
      dispatch(
        setAlertInfo({
          severity: 'success',
          message: 'Signed Out Successfully!😏',
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 3000);
    },
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <Alert severity="warning">Signing out....</Alert>;
};

export default SignOut;
