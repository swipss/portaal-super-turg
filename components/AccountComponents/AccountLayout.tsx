import React from 'react';
import Link from 'next/link';
import Header from '../Header';
import { Sidebar } from './Sidebar';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Layout from '../Layout';

const AccountLayout = ({ children }) => {
  const { data: session } = useSession();
  if (!session) return <Layout>Lehe kuvamiseks logi sisse</Layout>;
  return (
    <React.Fragment>
      <Header />
      <div className="flex  relative">
        <Sidebar />
        <div className="w-[900px] mx-auto px-2 mt-2 ">{children}</div>
      </div>
    </React.Fragment>
  );
};

export default AccountLayout;
