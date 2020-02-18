import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

export const CURRENT_USER_QUERY = gql`
  query {
    currentUser {
      name
      email
      permissions
    }
  }
`;

const useCurrentUser = () => {
  const { data: { currentUser } = {}, loading, error } = useQuery(CURRENT_USER_QUERY);
  return {
    currentUser,
    loading,
    error,
  };
};

export default useCurrentUser;
