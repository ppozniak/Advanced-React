import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import CurrentUser from './CurrentUser';

const Nav = () => (
  <NavStyles>
    <Link href="/">
      <a>Items</a>
    </Link>
    <Link href="/sell">
      <a>Sell</a>
    </Link>
    <Link href="/signup">
      <a>Signup</a>
    </Link>
    <Link href="/orders">
      <a>Orders</a>
    </Link>
    <CurrentUser />
  </NavStyles>
);

export default Nav;
