import { useEffect } from 'react';
import useRequst from '../../hooks/use-request';
import Router from 'next/router';

const SignOut = ({}) => {
  const { doRequest } = useRequst({
    method: 'post',
    url: '/api/users/signout',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing out....</div>;
};

export default SignOut;
