import { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button';
import FormError from '../../components/FormError';
import { usersApi } from '../../lib/api';

const inputClasses =
  'mt-1 w-full rounded-lg border-2 border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none transition duration-150 focus:border-nu-blue focus:bg-white';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await usersApi.list();
      setUsers(data.users ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const startEdit = (user) => {
    setEditingId(user._id);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      contactNumber: user.contactNumber,
      address: user.address,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await usersApi.update(editingId, editForm);
      setEditingId(null);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (user) => {
    setError('');
    try {
      await usersApi.update(user._id, { isActive: !user.isActive });
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <p className="mb-6 text-sm font-medium text-zinc-400">{users.length} users</p>

      {loading && <p className="text-sm text-zinc-500">Loading users...</p>}
      <FormError message={error} />

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-zinc-50 last:border-0">
                {editingId === user._id ? (
                  <td colSpan={5} className="px-5 py-4">
                    <form className="grid gap-3 sm:grid-cols-2" onSubmit={handleUpdate}>
                      <FormError message={error} />
                      <div>
                        <label className="text-xs font-semibold text-zinc-500">First Name</label>
                        <input
                          value={editForm.firstName}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, firstName: e.target.value }))}
                          required
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-500">Last Name</label>
                        <input
                          value={editForm.lastName}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, lastName: e.target.value }))}
                          required
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-500">Contact Number</label>
                        <input
                          value={editForm.contactNumber}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, contactNumber: e.target.value }))}
                          required
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-500">Address</label>
                        <input
                          value={editForm.address}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, address: e.target.value }))}
                          required
                          className={inputClasses}
                        />
                      </div>
                      <div className="flex gap-2 sm:col-span-2">
                        <Button type="submit" variant="gold" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                        <Button type="button" variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                      </div>
                    </form>
                  </td>
                ) : (
                  <>
                    <td className="px-5 py-4 font-medium text-zinc-900">{user.firstName} {user.lastName}</td>
                    <td className="px-5 py-4 text-zinc-500">{user.email}</td>
                    <td className="px-5 py-4 capitalize text-zinc-500">{user.type}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${user.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button type="button" variant="secondary" onClick={() => startEdit(user)}>Edit</Button>
                        <Button type="button" variant="secondary" onClick={() => toggleActive(user)}>
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
