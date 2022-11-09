import React from 'react';
import Header from '../Header';
import { useSession } from 'next-auth/react';
import Layout from '../Layout';

const AccountLayout = ({ children }) => {
  const { data: session } = useSession();
  if (!session) return <Layout>Lehe kuvamiseks logi sisse</Layout>;
  return (
    <React.Fragment>
      <Header />
      <div className="flex relative">
        <div className="w-[900px] mx-auto mt-2 ">{children}</div>
      </div>
    </React.Fragment>
  );
};

export default AccountLayout;
