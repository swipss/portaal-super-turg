import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Router from 'next/router';
import '../public/globals.css';
import { useState } from 'react';
import { Loader } from '../components/Loader';

const App = ({ Component, pageProps }: AppProps) => {
  const [loading, setLoading] = useState(false);
  Router.events.on('routeChangeStart', (url) => {
    setLoading(true);
  });

  Router.events.on('routeChangeComplete', (url) => {
    setLoading(false);
  });

  return (
    <SessionProvider session={pageProps.session}>
      {loading && <Loader />}
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
