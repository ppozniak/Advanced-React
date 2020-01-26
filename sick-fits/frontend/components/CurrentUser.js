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

const CurrentUser = ({ children }) => {
  const { data: { currentUser } = {} } = useQuery(CURRENT_USER_QUERY);
  return children(currentUser);
};

export default CurrentUser;
