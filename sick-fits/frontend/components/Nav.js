import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import SignOut from './SignOut';
import useCurrentUser from './useCurrentUser';

const Nav = () => {
  const { currentUser } = useCurrentUser();
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
    </NavStyles>
  );
};

export default Nav;
