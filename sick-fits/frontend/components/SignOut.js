import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { CURRENT_USER_QUERY } from '../hooks/useCurrentUser';

export const SIGN_OUT_MUTATION = gql`
  mutation {
    signOut {
      message
    }
  }
`;

const SignOut = ({ children }) => {
  const [signOut] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  return children(signOut);
};

export default SignOut;
