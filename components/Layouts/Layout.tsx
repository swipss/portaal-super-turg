import React, { ReactNode } from 'react';
import Header from './Header/Header';

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = ({
  children,
}: {
  children: React.ReactNode;
  userPosts: any;
}) => (
  <div>
    <Header />
    <div className="max-w-5xl p-5 mx-auto">{children}</div>
  </div>
);

export default Layout;
