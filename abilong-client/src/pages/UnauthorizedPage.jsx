import Button from '../components/Button';

const UnauthorizedPage = () => {
  return (
    <div className="flex w-full flex-col">
      <section className="bg-zinc-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-red-500">Error 403</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Access Denied
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Your account doesn't have permission to view this page.
          </p>
          <Button to="/" variant="primary" className="mt-8">Back to Home</Button>
        </div>
      </section>
    </div>
  );
};

export default UnauthorizedPage;
