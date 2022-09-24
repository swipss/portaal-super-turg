import React from 'react';
import Link from 'next/link';
import Header from '../Header';
import { Sidebar } from './Sidebar';
import Head from 'next/head';

const AccountLayout = ({ children }) => {
  return (
    <React.Fragment>
      <Header />
      <div className="flex gap-1 justify-center mt-2 mx-2">
        <Sidebar />
        <div className="w-[900px] px-6">{children}</div>
      </div>
    </React.Fragment>
  );
};

export default AccountLayout;
