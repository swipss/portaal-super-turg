import { GetStaticProps } from 'next';
import Head from 'next/head';
import React, { ReactNode } from 'react';
import prisma from '../lib/prisma';
import Header from './Header';

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = ({
  children,
  userPosts,
}: {
  children: React.ReactNode;
  userPosts: any;
}) => (
  <div>
    {userPosts}
    <Header />
    <div className="max-w-[1400px] mx-auto p-2">{children}</div>
  </div>
);

export default Layout;
