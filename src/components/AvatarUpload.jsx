import { useState, useRef } from 'react';
import api from '../lib/api.js';
import { useAuthStore } from '../store/auth.js';

export default function AvatarUpload({ size = 'md', editable = true }) {
  const { user, setUser } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-20 h-20 text-xl',
    lg: 'w-28 h-28 text-3xl',
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '?';

  const src = preview || user?.avatarUrl;

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const form = new FormData();
      form.append('photo', file);
      const { data } = await api.post('/upload/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser({ ...user, avatarUrl: data.avatarUrl });
      setPreview(null); // use the real URL now
    } catch (err) {
      console.error('Upload failed', err);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="relative inline-block">
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-brand-100 flex items-center justify-center font-bold text-brand-700 ring-2 ring-brand-200`}
      >
        {src ? (
          <img src={src} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
            <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        )}
      </div>

      {editable && (
        <>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 w-6 h-6 bg-brand-600 hover:bg-brand-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors text-xs"
            title="Change photo"
          >
            📷
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </>
      )}
    </div>
  );
}

// Read-only avatar (for other users)
export function Avatar({ avatarUrl, firstName, lastName, size = 'sm' }) {
  const sizeClasses = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-base',
    lg: 'w-20 h-20 text-xl',
  };

  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-brand-100 flex items-center justify-center font-bold text-brand-700 ring-2 ring-brand-200 shrink-0`}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={`${firstName} ${lastName}`} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
