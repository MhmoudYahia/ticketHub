import 'bootstrap/dist/css/bootstrap.css';
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/globals.css';

import buildClient from '../api/build-client';
import Header from '../components/header';
import { Provider, useSelector } from 'react-redux';
import store from '../redux/store';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Provider store={store}>
        <Header currentUser={currentUser} />
        <Component currentUser={currentUser} {...pageProps} />
      </Provider>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client
    );
  }
  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
