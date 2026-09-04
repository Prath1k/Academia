import React, { useState } from 'react';
import { X, UserRound } from 'lucide-react';
import { AuthUser, authService } from '../services/authService';

interface Props {
  user: AuthUser;
  onClose: () => void;
  onSaved: (user: AuthUser) => void;
}

export const ProfileModal: React.FC<Props> = ({ user, onClose, onSaved }) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [institutionOrCompany, setInstitutionOrCompany] = useState(user.institutionOrCompany || '');
  const [department, setDepartment] = useState(user.department || '');
  const [bio, setBio] = useState(user.bio || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const updatedUser = await authService.updateProfile(user.id, {
        fullName,
        institutionOrCompany,
        department,
        bio,
        phone
      });
      onSaved(updatedUser);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save your profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><UserRound className="h-5 w-5" /></div>
            <div>
              <h2 className="text-lg font-bold text-slate-950">Your profile</h2>
              <p className="text-xs text-slate-500">Keep your information current for better matches.</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close profile" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">Full name<input required value={fullName} onChange={event => setFullName(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-900" /></label>
            <label className="text-xs font-semibold text-slate-700">Email<input disabled value={user.email} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-500" /></label>
            <label className="text-xs font-semibold text-slate-700">Institution or company<input value={institutionOrCompany} onChange={event => setInstitutionOrCompany(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-900" /></label>
            <label className="text-xs font-semibold text-slate-700">Department or field<input value={department} onChange={event => setDepartment(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-900" /></label>
          </div>
          <label className="block text-xs font-semibold text-slate-700">Phone number<input value={phone} onChange={event => setPhone(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-900" /></label>
          <label className="block text-xs font-semibold text-slate-700">About you<textarea rows={3} value={bio} onChange={event => setBio(event.target.value)} className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-900" /></label>
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4"><button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? 'Saving...' : 'Save profile'}</button></div>
        </form>
      </div>
    </div>
  );
};
