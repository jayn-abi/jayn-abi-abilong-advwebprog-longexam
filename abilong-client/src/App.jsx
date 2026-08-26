import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// HomePage Structure
import Layout from './layouts/Layout';
import ProductPage from './pages/LandingPages/ProductPage';
import HomePage from './pages/LandingPages/HomePage';
import AboutPage from './pages/LandingPages/AboutPage';
import ProductListPage from './pages/LandingPages/ProductListPage';
import CartPage from './pages/CustomerPages/CartPage';
import OrdersPage from './pages/CustomerPages/OrdersPage';
import ProfilePage from './pages/ProfilePage';

// Supplier Pages Structure
import SupplierProductsPage from './pages/SupplierPages/SupplierProductsPage';

// Admin Pages Structure
import AdminLayout from './layouts/AdminLayout';
import AdminProductsPage from './pages/AdminPages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminPages/AdminOrdersPage';
import AdminReviewsPage from './pages/AdminPages/AdminReviewsPage';
import AdminUsersPage from './pages/AdminPages/AdminUsersPage';

// Auth Pages Structure
import AuthLayout from './layouts/AuthLayout';
import SignInPage from './pages/AuthPages/SignInPage';
import SignUpPage from './pages/AuthPages/SignUpPage';

import NotFoundPage from './pages/NotFoundPage';

const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'products',
        element: <ProductListPage />,
      },
      {
        path: 'products/:id',
        element: <ProductPage />,
      },
      {
        path: 'cart',
        element: (
          <ProtectedRoute roles={['customer']}>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute roles={['customer']}>
            <OrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'supplier/products',
        element: (
          <ProtectedRoute roles={['supplier']}>
            <SupplierProductsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute roles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: '', element: <AdminProductsPage /> },
          { path: 'products', element: <AdminProductsPage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
          { path: 'reviews', element: <AdminReviewsPage /> },
          { path: 'users', element: <AdminUsersPage /> },
        ],
      },
    ],
  },
  {
    path: "auth/",
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "signin",
        element: <SignInPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      }
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
