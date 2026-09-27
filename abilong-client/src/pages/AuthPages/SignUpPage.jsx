import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import PasswordInput from '../../components/PasswordInput';
import { useAuth, getHomePathForUser } from '../../context/auth-context';

const inputClasses =
  'mt-1.5 w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition duration-150 placeholder:text-zinc-400 focus:border-nu-blue focus:bg-white';

const selectClasses = `${inputClasses} appearance-none pr-10`;

const actionButtonClassName = 'w-full rounded-xl py-3 text-xs tracking-[0.2em]';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  contactNumber: '',
  type: 'customer',
  businessName: '',
  address: '',
  password: '',
};

const SignUpPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const newUser = await signup(form);
      navigate(getHomePathForUser(newUser));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">Sign Up</h1>
      <p className="mt-3 text-sm leading-6 text-zinc-500">
        Create an account for faster checkout, order updates, and pickup details.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
      )}

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="text-sm font-semibold text-zinc-700">
              First Name
            </label>
            <input
              id="first-name"
              type="text"
              placeholder="First name"
              autoComplete="given-name"
              value={form.firstName}
              onChange={updateField('firstName')}
              required
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="last-name" className="text-sm font-semibold text-zinc-700">
              Last Name
            </label>
            <input
              id="last-name"
              type="text"
              placeholder="Last name"
              autoComplete="family-name"
              value={form.lastName}
              onChange={updateField('lastName')}
              required
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-username" className="text-sm font-semibold text-zinc-700">
            Username
          </label>
          <input
            id="signup-username"
            type="text"
            placeholder="Username"
            autoComplete="username"
            value={form.username}
            onChange={updateField('username')}
            required
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="text-sm font-semibold text-zinc-700">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            placeholder="student@email.com"
            autoComplete="email"
            value={form.email}
            onChange={updateField('email')}
            required
            className={inputClasses}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="signup-contact" className="text-sm font-semibold text-zinc-700">
              Contact Number
            </label>
            <input
              id="signup-contact"
              type="tel"
              placeholder="09XX XXX XXXX"
              autoComplete="tel"
              value={form.contactNumber}
              onChange={updateField('contactNumber')}
              required
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="signup-type" className="text-sm font-semibold text-zinc-700">
              Account Type
            </label>
            <div className="relative">
              <select
                id="signup-type"
                value={form.type}
                onChange={updateField('type')}
                required
                className={selectClasses}
              >
                <option value="customer">Customer</option>
                <option value="supplier">Supplier</option>
                <option value="admin">Admin</option>
              </select>
              <svg
                className="pointer-events-none absolute right-4 top-1/2 mt-0.5 h-4 w-4 -translate-y-1/2 text-zinc-400"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 7.5L10 12.5L15 7.5" />
              </svg>
            </div>
          </div>
        </div>

        {form.type === 'supplier' && (
          <div>
            <label htmlFor="signup-business-name" className="text-sm font-semibold text-zinc-700">
              Business Name
            </label>
            <input
              id="signup-business-name"
              type="text"
              placeholder="e.g. Bulldog Supplies Co."
              value={form.businessName}
              onChange={updateField('businessName')}
              className={inputClasses}
            />
            <p className="mt-2 text-xs leading-5 text-zinc-400">
              Shown as the vendor name on products you list. Leave blank to use your full name.
            </p>
          </div>
        )}

        <div>
            <label htmlFor="signup-address" className="text-sm font-semibold text-zinc-700">
              Address
            </label>
            <input
              id="signup-address"
              type="text"
              placeholder="Address"
              autoComplete="street-address"
              value={form.address}
              onChange={updateField('address')}
              required
              className={inputClasses}
            />
          </div>
        <div>
          <label htmlFor="signup-password" className="text-sm font-semibold text-zinc-700">
            Password
          </label>
          <PasswordInput
            id="signup-password"
            placeholder="Password"
            autoComplete="new-password"
            value={form.password}
            onChange={updateField('password')}
            required
            minLength={8}
            className={inputClasses}
          />
          <p className="mt-2 text-xs leading-5 text-zinc-400">
            Use a secure password with letters, numbers, and symbols.
          </p>
        </div>

        <Button type="submit" variant="gold" className={actionButtonClassName} disabled={submitting}>
          {submitting ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="grid gap-3 pt-1 sm:grid-cols-2">
          <Button type="button" variant="secondary" className={actionButtonClassName}>
            Sign Up with Google
          </Button>
          <Button type="button" variant="secondary" className={actionButtonClassName}>
            Sign Up with Apple
          </Button>
        </div>
      </form>

      <div className="mt-8 border-t-2 border-zinc-100 pt-6 text-sm text-zinc-500">
        Already have an account?{' '}
        <Link to="/auth/signin" className="font-semibold text-nu-blue transition hover:text-nu-blue-light">
          Log In
        </Link>
      </div>
    </>
  );
};

export default SignUpPage;
