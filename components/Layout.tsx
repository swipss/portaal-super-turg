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
    <Header />
    <div className="max-w-[1400px] mx-auto p-2">{children}</div>
  </div>
);

export default Layout;
