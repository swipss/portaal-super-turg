import Head from 'next/head';
import React, { ReactNode } from 'react';
import Header from './Header';

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div>
    <Head>
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`}
      ></script>
    </Head>
    <Header />
    <div className="max-w-[1400px] m-auto ">{children}</div>
  </div>
);

export default Layout;
