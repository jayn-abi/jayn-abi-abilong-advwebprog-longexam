import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Layout = () => {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="pb-20 pt-[4.25rem]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
