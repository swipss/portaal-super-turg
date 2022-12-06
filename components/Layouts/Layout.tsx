import { GetStaticProps } from 'next';
import Head from 'next/head';
import React, { ReactNode } from 'react';
import prisma from '../../lib/prisma';
import Header from './Header/Header';

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
  <div className="bg-gray-100">
    {userPosts}
    <Header />
    <div className="p-5 max-w-5xl mx-auto">{children}</div>
  </div>
);

export default Layout;
