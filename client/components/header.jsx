import Link from 'next/link';

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: 'auth/signup' },
    !currentUser && { label: 'Sign In', href: 'auth/signin' },
    currentUser && { label: 'Sign Out', href: 'auth/signout' },
  ]
    .filter((link) => link)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link className="nav-link" href={href}>
            {label}
          </Link>
        </li>
      );
    });
  return (
    <nav className="navbar  navbar-light bg-light">
      <Link className="navbar-brand nav-link" href="/">
        GitTix
      </Link>

      <div className=" d-flex justify-content-end">
        <ul className=" nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
