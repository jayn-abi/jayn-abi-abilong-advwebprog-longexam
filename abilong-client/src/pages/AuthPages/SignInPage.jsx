import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import PasswordInput from '../../components/PasswordInput';
import { useAuth, getHomePathForUser } from '../../context/auth-context';

const inputClasses =
  'mt-1.5 w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition duration-150 placeholder:text-zinc-400 focus:border-nu-blue focus:bg-white';

const actionButtonClassName = 'w-full rounded-xl py-3 text-xs tracking-[0.2em]';

const SignInPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const loggedInUser = await login(email, password);
      navigate(getHomePathForUser(loggedInUser));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">Log In</h1>
      {/* <p className="mt-3 text-sm leading-6 text-zinc-500">
        Access your store account to review orders, saved items, and pickup details.
      </p> */}

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
      )}

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="signin-email" className="text-sm font-semibold text-zinc-700">
            Email Address
          </label>
          <input
            id="signin-email"
            type="email"
            placeholder="student@email.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="signin-password" className="text-sm font-semibold text-zinc-700">
            Password
          </label>
          <PasswordInput
            id="signin-password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClasses}
          />
          {/* <p className="mt-2 text-xs leading-5 text-zinc-400">
            It must be a combination of minimum 8 letters, numbers, and symbols.
          </p> */}
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex items-center gap-2 text-zinc-500">
            <input type="checkbox" className="h-4 w-4 rounded border-zinc-300 accent-nu-blue" />
            <span>Remember me</span>
          </label>
          <button type="button" className="text-sm font-semibold text-nu-blue transition hover:text-nu-blue-light">
            Forgot Password?
          </button>
        </div>

        <Button type="submit" variant="primary" className={actionButtonClassName} disabled={submitting}>
          {submitting ? 'Logging In...' : 'Log In'}
        </Button>

        <div className="grid gap-3 pt-1 sm:grid-cols-2">
          <Button type="button" variant="secondary" className={actionButtonClassName}>
            Log In with Google
          </Button>
          <Button type="button" variant="secondary" className={actionButtonClassName}>
            Log In with Apple
          </Button>
        </div>
      </form>

      <div className="mt-8 border-t-2 border-zinc-100 pt-6 text-sm text-zinc-500">
        No account yet?{' '}
        <Link to="/auth/signup" className="font-semibold text-nu-blue transition hover:text-nu-blue-light">
          Sign Up
        </Link>
      </div>
    </>
  );
};

export default SignInPage;
