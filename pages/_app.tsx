import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Router from 'next/router';
import '../public/globals.css';
import { useState } from 'react';
import { Loader } from '../components/Loader';
import Head from 'next/head';
import NProgress from 'nprogress';

const App = ({ Component, pageProps }: AppProps) => {
  const [loading, setLoading] = useState(false);
  Router.events.on('routeChangeStart', (url) => {
    NProgress.start();
    setLoading(true);
  });

  Router.events.on('routeChangeComplete', (url) => {
    NProgress.done();
    setLoading(false);
  });

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
          integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>
      {loading && <Loader />}
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
