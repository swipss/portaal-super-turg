import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '../public/globals.css';
import Head from 'next/head';
import { trpc } from '../utils/trpc';

const App = ({ Component, pageProps }: AppProps) => {
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
      {/* {loading && <Loader />} */}
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(App);
