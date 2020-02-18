import React from 'react';
import useCurrentUser from './CurrentUser';
import SignIn from './Form/SignIn';

const LogInGuard = ({ children }) => {
  const { currentUser, loading, error } = useCurrentUser();
  if (loading) return 'Loading...';
  if (error) return 'Error';

  if (currentUser) return children;

  return (
    <div>
      To view this page you need to log in. <SignIn />
    </div>
  );
};

export default LogInGuard;
