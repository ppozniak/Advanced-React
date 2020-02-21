import Link from 'next/link';
import { useMutation } from '@apollo/react-hooks';
import NavStyles from './styles/NavStyles';
import SignOut from './SignOut';
import useCurrentUser from './useCurrentUser';
import { TOGGLE_CART_MUTATION } from './Cart';

const Nav = () => {
  const { currentUser } = useCurrentUser();
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION);
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
      </button>
    </NavStyles>
  );
};

export default Nav;
