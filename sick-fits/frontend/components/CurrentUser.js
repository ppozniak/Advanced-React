import React from 'react';

import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';

export const CURRENT_USER_QUERY = gql`
  query {
    currentUser {
      name
      email
      permissions
    }
  }
`;

const CurrentUser = () => {
  const { data: { currentUser } = {} } = useQuery(CURRENT_USER_QUERY);
  if (currentUser) {
    return (
      <Link href="/me">
        <a>🛅 {currentUser.name}</a>
      </Link>
    );
  }
  return null;
};

export default CurrentUser;
