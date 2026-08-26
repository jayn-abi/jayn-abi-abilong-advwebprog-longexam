import { NavLink, Outlet } from 'react-router-dom';

const tabs = [
  { label: 'Products', to: '/admin/products' },
  { label: 'Orders', to: '/admin/orders' },
  { label: 'Reviews', to: '/admin/reviews' },
  { label: 'Users', to: '/admin/users' },
];

const tabClassName = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition duration-150',
    isActive ? 'bg-nu-blue text-white' : 'bg-white text-nu-blue border-2 border-zinc-200 hover:border-nu-blue',
  ].join(' ');

const AdminLayout = () => {
  return (
    <div className="flex w-full flex-col">
      <section className="relative overflow-hidden bg-nu-blue px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
        <div className="absolute inset-0 bg-linear-to-br from-nu-blue via-nu-blue to-nu-blue-light opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-nu-gold" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-nu-gold/40 bg-nu-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-nu-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-nu-gold" />
            Admin
          </span>
          <h1 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            Admin Dashboard
          </h1>
        </div>
      </section>

      <section className="bg-zinc-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-8 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <NavLink key={tab.to} to={tab.to} className={tabClassName}>
                {tab.label}
              </NavLink>
            ))}
          </nav>
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default AdminLayout;
