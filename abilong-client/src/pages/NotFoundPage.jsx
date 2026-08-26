import logoCompilation from '../assets/img/logoCompilation.png';
import Button from '../components/Button';
import NavBar from '../components/NavBar';

const quickLinks = [
  { label: 'Home', to: '/', desc: 'Return to the main storefront.' },
  { label: 'About', to: '/about', desc: 'Learn more about BulldogEx Shop.' },
  { label: 'Products', to: '/products', desc: 'Browse all campus items and merch.' },
];

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">

      <NavBar />

      
      <main className="flex flex-1 flex-col gap-6 py-6 pt-16">

       
        <section className="border-y-2 border-zinc-900 bg-zinc-900 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="flex-1">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                Error 404
              </p>
              <h1 className="text-7xl font-extrabold leading-none tracking-tight text-zinc-50 sm:text-9xl">
                404
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-zinc-400">
                The page you're looking for doesn't exist or may have been moved.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/" variant="outline">Back to Home</Button>
                <Button to="/products" variant="gold">View Products</Button>
              </div>
            </div>
            <div className="hidden lg:block lg:w-64 xl:w-80">
              <img
                src={logoCompilation}
                alt="BulldogEx"
                className="w-full rounded-2xl object-contain opacity-80"
              />
            </div>
          </div>
        </section>

        
        <section className="border-y-2 border-zinc-900 bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
              Quick Links
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">Explore the site</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {quickLinks.map((link) => (
                <div key={link.to} className="rounded-3xl border-2 border-zinc-900 bg-zinc-50 p-5">
                  <h3 className="font-semibold tracking-tight text-zinc-900">{link.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-zinc-500">{link.desc}</p>
                  <Button to={link.to} className="mt-4" variant="primary">Go to {link.label}</Button>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      
      <footer className="border-t-2 border-zinc-900 bg-zinc-900 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-zinc-50">BulldogEx Shop</p>
          <p className="text-[11px] text-zinc-500">
            &copy; {new Date().getFullYear()} NU Campus Marketplace
          </p>
        </div>
      </footer>

    </div>
  );
};

export default NotFoundPage;
