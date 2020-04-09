import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { PERMISSION_TYPES } from '../pages/admin/permissions';

export const CURRENT_USER_QUERY = gql`
  query {
    currentUser {
      id
      name
      email
      permissions
    }
  }
`;

const useCurrentUser = () => {
  const { data: { currentUser } = {}, loading, error } = useQuery(CURRENT_USER_QUERY);

  const isUserAdmin = currentUser && currentUser.permissions.includes(PERMISSION_TYPES.ADMIN);
  const isUserCreatorOfItem = item => currentUser && currentUser.id === item.user.id;

  return {
    isUserAdmin,
    isUserCreatorOfItem,
    currentUser,
    loading,
    error,
  };
};

export default useCurrentUser;
