import { useAuthStore } from '../../store/auth.js';
import AvatarUpload from '../../components/AvatarUpload.jsx';

export default function CustomerProfile() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-lg mx-auto px-4 py-12 space-y-8">

      {/* Avatar section */}
      <div className="card flex flex-col items-center gap-4 py-8">
        <AvatarUpload size="lg" />
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          {user?.phone && <p className="text-gray-500 text-sm">{user.phone}</p>}
        </div>
        <p className="text-xs text-gray-400">Click the 📷 to change your profile photo</p>
      </div>

      {/* Account info */}
      <div className="card space-y-4">
        <h2 className="font-bold text-lg">Account Info</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">First name</p>
            <p className="font-semibold text-gray-900">{user?.firstName}</p>
          </div>
          <div>
            <p className="text-gray-500">Last name</p>
            <p className="font-semibold text-gray-900">{user?.lastName}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold text-gray-900">{user?.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-semibold text-gray-900">{user?.phone || '—'}</p>
          </div>
          <div>
            <p className="text-gray-500">Member since</p>
            <p className="font-semibold text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Account type</p>
            <p className="font-semibold text-gray-900 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
