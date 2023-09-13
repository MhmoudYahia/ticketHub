import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return <h3> Hello in Ticketing </h3>;
};

LandingPage.getInitialProps = async (context) => {  // has access to the request comming from browser
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');

  return data;
};
export default LandingPage;
