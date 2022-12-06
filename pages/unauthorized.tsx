import React from 'react';
import Header from '../components/Layouts/Header/Header';

const Unauthorized: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Header />
      <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
        {children}
      </div>
    </>
  );
};

export default Unauthorized;
