import Button from '../../components/Button';
import banner from '../../assets/img/nu_bulldogex_banner.jpg';
import totebag from '../../assets/img/totebag.jpg';
import shirt1 from '../../assets/img/shirt1.jpg';
import products from '../../assets/img/products.jpg';
import { useAsync } from '../../hooks/useAsync';
import { productsApi, categoriesApi, suppliersApi } from '../../lib/api';

const statIcons = {
  products: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  categories: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  suppliers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  stock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
};

const categories = [
  {
    title: 'Accessories & Essentials',
    desc: 'Bags, tumblers, lanyards, and items used every school day.',
    cta: 'View Products',
    image: totebag,
  },
  {
    title: 'Drinkware',
    desc: 'Tumblers, Duffle Bag, and other essentials for active campus life.',
    cta: 'View Items',
    image: products,
  
  },
  {
    title: 'Apparel',
    desc: 'Comfortable pieces for class days, commute days, and weekends.',
    cta: 'View Apparel',
    image: shirt1,
  },
];

const formatStat = (value, loading) => (loading ? '—' : String(value).padStart(2, '0'));

const HomePage = () => {
  const { data: overview, loading } = useAsync(
    () =>
      Promise.all([productsApi.list({ limit: 1000 }), categoriesApi.list(), suppliersApi.list()]),
    [],
  );
  const [productsData, categoriesData, suppliersData] = overview ?? [];
  const totalStock = productsData?.products?.reduce((sum, p) => sum + p.stock, 0) ?? 0;

  const stats = [
    { value: formatStat(productsData?.total ?? 0, loading), label: 'Products', icon: statIcons.products },
    { value: formatStat(categoriesData?.categories?.length ?? 0, loading), label: 'Categories', icon: statIcons.categories },
    { value: formatStat(suppliersData?.suppliers?.length ?? 0, loading), label: 'Suppliers', icon: statIcons.suppliers },
    { value: formatStat(totalStock, loading), label: 'Items In Stock', icon: statIcons.stock },
  ];

  return (
    <div className="flex w-full flex-col">

      
      <section className="relative min-h-[560px] overflow-hidden bg-nu-blue px-4 py-20 sm:px-6 lg:px-8">
        <img
          src={banner}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
        />
       
        <div className="absolute inset-0 bg-gradient-to-br from-nu-blue via-nu-blue/90 to-nu-blue/60" />
       
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-nu-gold" />

        <div className="relative z-10 mx-auto max-w-6xl flex justify-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-nu-gold/40 bg-nu-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-nu-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-nu-gold" />
              NU Campus Marketplace
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Welcome to<br />
              <span className="text-nu-gold">BulldogEx</span> Shop
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
              Explore campus uniforms, student essentials, and school merch in one
              quick storefront built for NU students.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/products" variant="gold">
                Shop Now
              </Button>
              <Button to="/about" variant="outline">
                About Store
              </Button>
            </div>
          </div>
        </div>
      </section>

      
      <section className="border-b border-zinc-200 bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-nu-blue/50">
              Store Overview
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900">Quick shopping stats</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ value, label, icon }) => (
              <div
                key={label}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-6 transition hover:border-nu-blue/30 hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-nu-blue/10 text-nu-blue transition group-hover:bg-nu-blue group-hover:text-white">
                  {icon}
                </div>
                <p className="text-4xl font-extrabold tracking-tight text-nu-blue">{value}</p>
                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      <section className="bg-zinc-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-nu-blue/50">
              Shop Sections
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900">Browse by category</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {categories.map(({ title, desc, cta, image, icon }) => (
              <article
                key={title}
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-lg hover:-translate-y-0.5 duration-200"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100">
                  {image ? (
                    <img
                      src={image}
                      alt={title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
                      {icon}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold tracking-tight text-zinc-900">{title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-zinc-500">{desc}</p>
                  <Button to="/products" variant="primary" className="mt-5">{cta}</Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
