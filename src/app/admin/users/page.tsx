'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [canView, setCanView] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [canAdd, setCanAdd] = useState(false);
  const [accessibleStartups, setAccessibleStartups] = useState('ALL'); // Comma separated for specific IDs
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');
    
    // Parse accessible startups
    let parsedAccess: 'ALL' | string[] = 'ALL';
    if (accessibleStartups.trim() !== 'ALL') {
      parsedAccess = accessibleStartups.split(',').map(id => id.trim()).filter(Boolean);
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role,
          permissions: {
            canView,
            canEdit,
            canAdd,
            accessibleStartups: parsedAccess
          }
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setUsers([data.user, ...users]);
        setEmail('');
        setPassword('');
        setSuccessMsg('User created successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(data.error || 'Failed to create user');
      }
    } catch (error) {
      setErrorMsg('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline-md font-bold text-on-surface">User Management</h1>
        <p className="text-on-surface-variant mt-2">Manage admin and user accounts and their startup permissions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create User Form */}
        <div className="lg:col-span-1 bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant shadow-sm h-fit">
          <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-orange">person_add</span>
            Create New User
          </h2>
          
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 bg-surface-variant/50 border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-orange" />
            </div>
            
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 bg-surface-variant/50 border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-orange" />
            </div>
            
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full mt-1 bg-surface-variant/50 border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-orange">
                <option value="user">User (Restricted)</option>
                <option value="admin">Admin (Full Access)</option>
              </select>
            </div>
            
            <div className="pt-4 border-t border-outline-variant/50">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 block">Permissions</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={canView} onChange={e => setCanView(e.target.checked)} className="w-5 h-5 rounded border-outline-variant accent-brand-orange" />
                  <span className="text-sm font-medium">Can View Startups</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={canEdit} onChange={e => setCanEdit(e.target.checked)} className="w-5 h-5 rounded border-outline-variant accent-brand-orange" />
                  <span className="text-sm font-medium">Can Edit Startups</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={canAdd} onChange={e => setCanAdd(e.target.checked)} className="w-5 h-5 rounded border-outline-variant accent-brand-orange" />
                  <span className="text-sm font-medium">Can Add New Startups</span>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Startup Access</label>
              <p className="text-[10px] text-on-surface-variant mb-2">Use 'ALL' for full access, or paste comma-separated Registration IDs (e.g. PU-123, PU-456)</p>
              <input type="text" required value={accessibleStartups} onChange={e => setAccessibleStartups(e.target.value)} className="w-full mt-1 bg-surface-variant/50 border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-orange" />
            </div>

            {successMsg && <div className="text-sm text-green-600 bg-green-500/10 p-3 rounded-lg border border-green-500/20">{successMsg}</div>}
            {errorMsg && <div className="text-sm text-red-600 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{errorMsg}</div>}

            <button type="submit" disabled={isSubmitting} className="w-full mt-6 py-3 bg-brand-orange text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-md">
              {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>

        {/* User List */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-orange">group</span>
            Registered Users
          </h2>
          
          {isLoading ? (
            <p className="text-center text-on-surface-variant py-8">Loading users...</p>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user._id} className="p-5 bg-surface-container rounded-2xl border border-outline-variant/50 flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-on-surface">{user.email}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
                    {user.permissions.canView && <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded">View</span>}
                    {user.permissions.canEdit && <span className="px-2 py-1 bg-brand-orange/10 text-brand-orange rounded">Edit</span>}
                    {user.permissions.canAdd && <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded">Add</span>}
                    <span className="px-2 py-1 bg-surface-variant text-on-surface-variant rounded flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">database</span>
                      {Array.isArray(user.permissions.accessibleStartups) 
                        ? `${user.permissions.accessibleStartups.length} specific startups` 
                        : 'ALL startups'}
                    </span>
                  </div>
                </div>
              ))}
              
              {users.length === 0 && (
                <p className="text-center text-on-surface-variant py-8">No users found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
