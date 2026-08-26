import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/img/nubdexchange_logo.png';
import { useAuth } from '../context/auth-context';
import { useCart } from '../context/cart-context';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Products', to: '/products' },
];

const navLinkClassName = ({ isActive }) =>
  [
    'relative px-1 py-2 text-sm font-semibold transition duration-150 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:transition-all after:duration-200',
    isActive
      ? 'text-nu-blue after:w-full after:bg-nu-blue'
      : 'text-zinc-500 hover:text-nu-blue after:w-0 hover:after:w-full hover:after:bg-nu-blue',
  ].join(' ');

const NavBar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200/80 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="relative h-9 w-9 shrink-0">
            <div className="absolute inset-0 rounded-full bg-nu-blue/10 transition group-hover:bg-nu-blue/20" />
            <img src={logo} alt="BulldogEx" className="relative h-full w-full rounded-full object-contain p-0.5" />
          </div>
          <div>
            <p className="text-sm font-extrabold leading-none tracking-tight text-nu-blue">BulldogEx</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Campus Shop</p>
          </div>
        </NavLink>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={navLinkClassName}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <nav aria-label="Account navigation" className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              {user.type === 'customer' && (
                <>
                  <NavLink
                    to="/orders"
                    className={({ isActive }) =>
                      [
                        'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition duration-150',
                        isActive ? 'bg-nu-blue text-white' : 'text-nu-blue hover:bg-zinc-100',
                      ].join(' ')
                    }
                  >
                    Orders
                  </NavLink>
                  <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                      [
                        'relative rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition duration-150',
                        isActive ? 'bg-nu-blue text-white' : 'text-nu-blue hover:bg-zinc-100',
                      ].join(' ')
                    }
                  >
                    Cart
                    {itemCount > 0 && (
                      <span className="ml-1.5 rounded-full bg-nu-gold px-1.5 py-0.5 text-[10px] font-bold text-nu-blue">
                        {itemCount}
                      </span>
                    )}
                  </NavLink>
                </>
              )}
              {user.type === 'supplier' && (
                <NavLink
                  to="/supplier/products"
                  className={({ isActive }) =>
                    [
                      'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition duration-150',
                      isActive ? 'bg-nu-blue text-white' : 'text-nu-blue hover:bg-zinc-100',
                    ].join(' ')
                  }
                >
                  My Products
                </NavLink>
              )}
              {user.type === 'admin' && (
                <NavLink
                  to="/admin/products"
                  className={({ isActive }) =>
                    [
                      'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition duration-150',
                      isActive ? 'bg-nu-blue text-white' : 'text-nu-blue hover:bg-zinc-100',
                    ].join(' ')
                  }
                >
                  Admin Dashboard
                </NavLink>
              )}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  [
                    'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition duration-150',
                    isActive ? 'bg-nu-blue text-white' : 'text-nu-blue hover:bg-zinc-100',
                  ].join(' ')
                }
              >
                Profile
              </NavLink>
              <span className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Hi, {user.firstName}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-nu-blue transition duration-150 hover:bg-zinc-100 cursor-pointer"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/auth/signin"
                className={({ isActive }) =>
                  [
                    'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition duration-150',
                    isActive
                      ? 'bg-nu-blue text-white'
                      : 'text-nu-blue hover:bg-zinc-100',
                  ].join(' ')
                }
              >
                Sign In
              </NavLink>
              <NavLink
                to="/auth/signup"
                className={({ isActive }) =>
                  [
                    'rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition duration-150 shadow-sm',
                    isActive
                      ? 'bg-nu-gold text-nu-blue'
                      : 'bg-nu-gold text-nu-blue hover:bg-nu-gold-light',
                  ].join(' ')
                }
              >
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
