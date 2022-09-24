import { NextPage } from 'next';
import React from 'react';
import AccountLayout from '../../components/AccountComponents/AccountLayout';

const AccountData: NextPage = () => {
  return (
    <AccountLayout>
      <div className="flex justify-between items-center bg-gray-50 rounded p-2 ">
        <p>Mail (login)</p>
        <em>vassiljevsten1@gmail.com</em>
        <img
          src="https://st2.depositphotos.com/4111759/12123/v/450/depositphotos_121232442-stock-illustration-male-default-placeholder-avatar-profile.jpg?forcejpeg=true"
          className="h-16 w-16  rounded"
        />
      </div>
    </AccountLayout>
  );
};

export default AccountData;
