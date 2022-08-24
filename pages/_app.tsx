import { AppProps } from "next/app";
import {SessionProvider} from 'next-auth/react'
import '../public/globals.css'
import { RecoilRoot } from "recoil";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  );
};

export default App;
