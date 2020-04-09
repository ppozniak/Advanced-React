import { useMutation } from '@apollo/react-hooks';
import { ADD_TO_CART_MUTATION, CART_QUERY } from '../components/Cart';

const useAddToCart = ({ id, currentUser }) => {
  const [addToCart, { loading: addingToCart }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: {
      itemId: id,
    },
    refetchQueries: [
      {
        query: CART_QUERY,
      },
    ],
  });

  let buttonText = 'Add to cart';

  if (!currentUser) buttonText = 'Log in to add to cart';
  else if (addingToCart) buttonText = 'Adding...';

  return {
    buttonText,
    addToCart,
    addingToCart,
  };
};

export default useAddToCart;
