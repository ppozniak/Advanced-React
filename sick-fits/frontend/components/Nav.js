import Link from 'next/link';
import { useMutation, useQuery } from '@apollo/react-hooks';
import NavStyles from './styles/NavStyles';
import SignOut from './SignOut';
import useCurrentUser from '../hooks/useCurrentUser';
import { TOGGLE_CART_MUTATION, CartItemsQuantity, CART_QUERY } from './Cart';

const Nav = () => {
  const { currentUser } = useCurrentUser();
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION);
  const {
    data: { currentUser: currentUserWithCart } = {},
    loading: loadingCart,
    networkStatus,
  } = useQuery(CART_QUERY, {
    notifyOnNetworkStatusChange: true,
  });
  const cart = (currentUserWithCart && currentUserWithCart.cart) || [];
  const totalQuantity = cart.reduce((total, cartItem) => total + cartItem.quantity, 0);

  return (
    <NavStyles>
      <Link href="/">
        <a>Shop</a>
      </Link>

      {/* User logged OUT */}
      {!currentUser && (
        <Link href="/signup">
          <a>Sign up</a>
        </Link>
      )}
      {/* User logged in */}
      {!!currentUser && (
        <>
          <Link href="/sell">
            <a>Sell</a>
          </Link>
          <Link href="/orders">
            <a>Orders</a>
          </Link>
          <Link href="/account">
            <a>👤{currentUser.name}</a>
          </Link>
          <SignOut>
            {signOut => (
              <button type="button" onClick={signOut}>
                Sign out
              </button>
            )}
          </SignOut>
        </>
      )}
      <button type="button" onClick={toggleCart}>
        🛒
        <CartItemsQuantity quantity={totalQuantity} loading={loadingCart || networkStatus === 1} />
      </button>
    </NavStyles>
  );
};

export default Nav;
