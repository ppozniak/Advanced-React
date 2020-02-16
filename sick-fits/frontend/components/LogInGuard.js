import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { CURRENT_USER_QUERY } from './CurrentUser';
import SignIn from './Form/SignIn';

const LogInGuard = ({ children }) => {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
  if (loading) return 'Loading...';
  if (error) return 'Error';

  if (data.currentUser) return children;

  return (
    <div>
      To view this page you need to log in. <SignIn />
    </div>
  );
};

export default LogInGuard;
