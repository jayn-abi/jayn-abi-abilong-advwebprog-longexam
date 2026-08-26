import { NavLink } from 'react-router-dom';
import logo from '../assets/img/nubdexchange_logo.png';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Products', to: '/products' },
];

const authLinks = [
  { label: 'Sign In', to: '/auth/signin' },
  { label: 'Sign Up', to: '/auth/signup' },
];

const Footer = () => {
  return (
    <footer className="bg-nu-blue">
     
      <div className="h-1 w-full bg-nu-gold" />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-3">

          
          <div className="sm:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0">
                <div className="absolute inset-0 rounded-full bg-nu-gold/20" />
                <img
                  src={logo}
                  alt="BulldogEx"
                  className="relative h-full w-full rounded-full object-contain p-0.5"
                />
              </div>
              <div>
                <p className="text-sm font-extrabold leading-none text-white">BulldogEx</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-nu-gold/70">Campus Shop</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Campus essentials, student merch, and uniforms — all in one simple storefront for NU students.
            </p>
          </div>

          
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-nu-gold">
              Browse
            </p>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      [
                        'text-sm transition duration-150',
                        isActive ? 'font-semibold text-nu-gold' : 'text-zinc-400 hover:text-white',
                      ].join(' ')
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-nu-gold">
              Account
            </p>
            <ul className="mt-4 space-y-2.5">
              {authLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      [
                        'text-sm transition duration-150',
                        isActive ? 'font-semibold text-nu-gold' : 'text-zinc-400 hover:text-white',
                      ].join(' ')
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

        </div>

      
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* <p className="text-[11px] text-zinc-500">
            &copy; {new Date().getFullYear()} BulldogEx Shop. 
          </p> */}
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-nu-gold/60">
            NU Campus Marketplace
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
