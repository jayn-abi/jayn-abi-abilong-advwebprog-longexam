import { Link, Outlet } from 'react-router-dom';
import logo from '../assets/img/nubdexchange_logo.png';

const stats = [
  { value: '08', label: 'Products' },
  { value: '06', label: 'Categories' },
  { value: '24', label: 'Orders' },
];

const AuthLayout = () => {
  return (
    <section className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="grid min-h-screen w-full lg:grid-cols-[1fr_0.95fr]">

        {/* Branding panel */}
        <div className="flex items-center justify-center border-b-2 border-zinc-200 bg-nu-blue p-8 sm:p-12 lg:border-b-0 lg:border-r-2 lg:border-zinc-200 lg:p-16">
          <div className="flex w-full max-w-sm flex-col items-center text-center">
            <Link to="/" className="inline-block">
              <img
                src={logo}
                alt="BulldogEx"
                className="h-20 w-20 rounded-full border-2 border-nu-gold bg-white object-contain p-1"
              />
            </Link>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-white">
              BulldogEx Shop
            </h1>
            <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-300">
              Campus essentials, student merch, and uniforms — all in one simple storefront for NU students.
            </p>

            <div className="mt-10 grid w-full grid-cols-3 gap-4 border-t border-white/20 pt-8">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-bold text-nu-gold">{value}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        
        <main className="flex items-center bg-white px-6 py-12 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <Outlet />
          </div>
        </main>

      </div>
    </section>
  );
};

export default AuthLayout;
