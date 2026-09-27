import { useState } from 'react';
import Button from '../components/Button';
import FormError from '../components/FormError';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../context/auth-context';
import { usersApi } from '../lib/api';

const inputClasses =
  'mt-1.5 w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition duration-150 placeholder:text-zinc-400 focus:border-nu-blue focus:bg-white';

const typeLabels = { customer: 'Customer', supplier: 'Supplier', admin: 'Admin' };

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();

  const [infoForm, setInfoForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    username: user?.username ?? '',
    contactNumber: user?.contactNumber ?? '',
    address: user?.address ?? '',
  });
  const [infoError, setInfoError] = useState('');
  const [infoSuccess, setInfoSuccess] = useState('');
  const [savingInfo, setSavingInfo] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const updateInfoField = (field) => (e) => setInfoForm((prev) => ({ ...prev, [field]: e.target.value }));
  const updatePasswordField = (field) => (e) => setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setInfoError('');
    setInfoSuccess('');
    setSavingInfo(true);
    try {
      await usersApi.updateMe(infoForm);
      await refreshUser();
      setInfoSuccess('Profile updated successfully.');
    } catch (err) {
      setInfoError(err.message);
    } finally {
      setSavingInfo(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setSavingPassword(true);
    try {
      await usersApi.changeMyPassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setPasswordSuccess('Password changed successfully.');
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <section className="relative overflow-hidden bg-nu-blue px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
        <div className="absolute inset-0 bg-linear-to-br from-nu-blue via-nu-blue to-nu-blue-light opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-nu-gold" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-nu-gold/40 bg-nu-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-nu-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-nu-gold" />
            {typeLabels[user?.type] ?? 'Account'}
          </span>
          <h1 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            Your Profile
          </h1>
        </div>
      </section>

      <section className="bg-zinc-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2 lg:items-start">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-nu-blue/50">Edit Information</p>
            <form className="mt-5 space-y-4" onSubmit={handleInfoSubmit}>
              <FormError message={infoError} />
              {infoSuccess && (
                <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">{infoSuccess}</p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="profile-first-name" className="text-sm font-semibold text-zinc-700">First Name</label>
                  <input
                    id="profile-first-name"
                    type="text"
                    value={infoForm.firstName}
                    onChange={updateInfoField('firstName')}
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="profile-last-name" className="text-sm font-semibold text-zinc-700">Last Name</label>
                  <input
                    id="profile-last-name"
                    type="text"
                    value={infoForm.lastName}
                    onChange={updateInfoField('lastName')}
                    required
                    className={inputClasses}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="profile-username" className="text-sm font-semibold text-zinc-700">Username</label>
                <input
                  id="profile-username"
                  type="text"
                  value={infoForm.username}
                  onChange={updateInfoField('username')}
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="profile-email" className="text-sm font-semibold text-zinc-700">Email</label>
                <input
                  id="profile-email"
                  type="email"
                  value={user?.email ?? ''}
                  disabled
                  className={`${inputClasses} cursor-not-allowed text-zinc-400`}
                />
              </div>
              <div>
                <label htmlFor="profile-contact" className="text-sm font-semibold text-zinc-700">Contact Number</label>
                <input
                  id="profile-contact"
                  type="tel"
                  value={infoForm.contactNumber}
                  onChange={updateInfoField('contactNumber')}
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="profile-address" className="text-sm font-semibold text-zinc-700">Address</label>
                <input
                  id="profile-address"
                  type="text"
                  value={infoForm.address}
                  onChange={updateInfoField('address')}
                  required
                  className={inputClasses}
                />
              </div>
              <Button type="submit" variant="gold" className="w-full py-3 text-xs tracking-[0.2em]" disabled={savingInfo}>
                {savingInfo ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-nu-blue/50">Change Password</p>
            <form className="mt-5 space-y-4" onSubmit={handlePasswordSubmit}>
              <FormError message={passwordError} />
              {passwordSuccess && (
                <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">{passwordSuccess}</p>
              )}
              <div>
                <label htmlFor="profile-current-password" className="text-sm font-semibold text-zinc-700">Current Password</label>
                <PasswordInput
                  id="profile-current-password"
                  autoComplete="current-password"
                  value={passwordForm.currentPassword}
                  onChange={updatePasswordField('currentPassword')}
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="profile-new-password" className="text-sm font-semibold text-zinc-700">New Password</label>
                <PasswordInput
                  id="profile-new-password"
                  autoComplete="new-password"
                  value={passwordForm.newPassword}
                  onChange={updatePasswordField('newPassword')}
                  required
                  minLength={8}
                  className={inputClasses}
                />
              </div>
              <Button type="submit" variant="primary" className="w-full py-3 text-xs tracking-[0.2em]" disabled={savingPassword}>
                {savingPassword ? 'Updating...' : 'Change Password'}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
