import Button from '../../components/Button';
import banner from '../../assets/img/nu_bulldogex_banner.jpg';
import shirt1 from '../../assets/img/shirt1.jpg';
import shirt2 from '../../assets/img/shirt2.jpg';
import shirt3 from '../../assets/img/shirt3.jpg';
import sweater2 from '../../assets/img/sweater2.jpg';

const stats = [
  { value: '08', label: 'Items' },
  { value: '06', label: 'Categories' },
  { value: '03', label: 'Pickup Slots' },
  { value: '24', label: 'Orders' },
];

const storeFlow = [
  {
    title: 'Curated Catalog',
    desc: 'Products are grouped by daily need so shoppers can scan faster.',
  },
  {
    title: 'Simple Checkout',
    desc: 'Product pages keep price, stock, and action buttons easy to find.',
  },
  {
    title: 'Pickup Ready',
    desc: 'Store information stays direct for students who need quick order updates.',
  },
];

const categoryImages = [shirt1, shirt2, shirt3, sweater2];

const AboutPage = () => {
  return (
    <div className="flex w-full flex-col">


      <section className="border-b-2 border-zinc-200 bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-3xl border-2 border-zinc-200 shadow-sm">
            <img
              src={banner}
              alt="BulldogEx campus"
              className="h-full w-full object-cover min-h-72"
            />
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-nu-blue/60">
              About Store
            </p>
            <h1 className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
              A campus shop focused on useful products and simple ordering.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-500 sm:text-base sm:leading-8">
              BulldogEx Shop presents clear product categories, quick actions, and
              straightforward store information for NU students.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button to="/" variant="primary">Back Home</Button>
              <Button to="/products" variant="secondary">Open Products</Button>
            </div>
          </div>
        </div>
      </section>

      
      <section className="border-b-2 border-zinc-200 bg-zinc-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-nu-blue/60">
            Store Overview
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">Quick store numbers</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="rounded-3xl border-2 border-nu-blue/20 bg-white p-6 shadow-sm">
              <p className="text-4xl font-extrabold tracking-tight text-nu-blue">{value}</p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      
      <section className="bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-nu-blue/60">
              Store Flow
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">How shopping works</h2>

            <div className="mt-6 space-y-4">
              {storeFlow.map(({ title, desc }) => (
                <article key={title} className="rounded-3xl border-2 border-zinc-200 bg-zinc-50 p-5">
                  <h3 className="text-base font-semibold tracking-tight text-nu-blue">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{desc}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border-2 border-zinc-200 bg-zinc-50 p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-nu-blue/60">
              Campus Apparel
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {categoryImages.map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-2xl border border-zinc-200">
                  <img src={img} alt={`Campus item ${i + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <Button to="/products" variant="primary" className="mt-5">View Products</Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
