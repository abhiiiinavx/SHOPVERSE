import React from 'react';
import { Toaster } from 'react-hot-toast';

const RootLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-light dark:bg-dark">
      {children}
      <Toaster position="top-right" />
    </div>
  );
};

export default RootLayout;
