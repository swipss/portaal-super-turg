import React from 'react';
import User from '../pages/user/[id]';
import Header from './Header';

const UserLayout = ({ children }) => {
  return (
    <React.Fragment>
      <Header />
      <div>
        <div className="md:w-[900px] px-2">{children}</div>
      </div>
    </React.Fragment>
  );
};

export default UserLayout;
