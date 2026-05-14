import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import api from '../../lib/api.js';
import { useAuthStore } from '../../store/auth.js';
import { Avatar } from '../../components/AvatarUpload.jsx';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  DISPUTED: 'bg-orange-100 text-orange-800',
};

export default function BookingDetail() {
  const { id } = useParams();
  const { user, accessToken } = useAuthStore();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const photoInputRef = useRef();
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    api.get(`/bookings/${id}`).then(({ data }) => {
      setBooking(data);
      setMessages(data.messages || []);
    }).finally(() => setLoading(false));

    // Socket.io
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const socket = io(socketUrl, { auth: { token: accessToken } });
    socketRef.current = socket;
    socket.emit('join-booking', id);
    socket.on('new-message', (msg) => setMessages((prev) => [...prev, msg]));

    return () => {
      socket.emit('leave-booking', id);
      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function updateStatus(status) {
    try {
      const { data } = await api.patch(`/bookings/${id}/status`, { status });
      setBooking((b) => ({ ...b, status: data.status }));
      toast.success(`Booking ${status.toLowerCase()}`);
    } catch {
      toast.error('Could not update status');
    }
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!newMsg.trim()) return;
    socketRef.current?.emit('send-message', { bookingId: id, content: newMsg });
    setNewMsg('');
  }

  async function uploadJobPhotos(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingPhotos(true);
    try {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append('photos', f));
      const { data } = await api.post(`/upload/job/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBooking((b) => ({ ...b, jobPhotos: JSON.stringify(data.jobPhotos) }));
      toast.success(`${files.length} photo${files.length > 1 ? 's' : ''} uploaded!`);
    } catch {
      toast.error('Could not upload photos');
    } finally {
      setUploadingPhotos(false);
    }
  }

  async function submitReview() {
    if (!rating) return toast.error('Select a rating');
    try {
      await api.post(`/bookings/${id}/review`, { rating, comment: reviewComment });
      toast.success('Review submitted!');
      setBooking((b) => ({ ...b, review: { rating, comment: reviewComment } }));
    } catch {
      toast.error('Could not submit review');
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-500">Loading…</div>;
  if (!booking) return <div className="text-center py-20 text-gray-500">Booking not found.</div>;

  const isCustomer = user?.role === 'CUSTOMER';
  const isProvider = user?.role === 'PROVIDER';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1">
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
        {/* Main */}
        <div className="lg:col-span-3 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <span className={`badge text-sm px-3 py-1 ${STATUS_COLORS[booking.status]}`}>{booking.status}</span>
              <span className="text-sm text-gray-500">#{booking.id.slice(-8)}</span>
            </div>

            <h1 className="text-xl font-bold mb-1">{booking.trade?.name} Service</h1>
            <p className="text-gray-600">{booking.description}</p>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-semibold">{format(new Date(booking.scheduledDate), 'EEEE, MMM d yyyy')}</p>
              </div>
              <div>
                <p className="text-gray-500">Time</p>
                <p className="font-semibold">{booking.scheduledTime} · {booking.durationHours}h</p>
              </div>
              <div>
                <p className="text-gray-500">Address</p>
                <p className="font-semibold">{booking.address}, {booking.city}</p>
              </div>
              <div>
                <p className="text-gray-500">Price</p>
                <p className="font-semibold text-brand-700">
                  {booking.finalPrice ? `$${booking.finalPrice}` : `$${booking.estimatedMin}–$${booking.estimatedMax} est.`}
                </p>
              </div>
            </div>
          </div>

          {/* Problem Photos */}
          {(() => {
            const photos = booking.problemPhotos ? JSON.parse(booking.problemPhotos) : [];
            if (photos.length === 0) return null;
            return (
              <div className="card">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">📷 Problem photos from customer</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {photos.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer">
                      <img src={url} alt={`Problem ${i + 1}`} className="w-full h-28 object-cover rounded-xl hover:opacity-90 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Actions */}
          <div className="card">
            <h3 className="font-bold mb-4">Actions</h3>
            <div className="flex flex-wrap gap-3">
              {isProvider && booking.status === 'PENDING' && (
                <button onClick={() => updateStatus('CONFIRMED')} className="btn-primary">Confirm booking</button>
              )}
              {isProvider && booking.status === 'CONFIRMED' && (
                <button onClick={() => updateStatus('IN_PROGRESS')} className="btn-primary">Mark as in progress</button>
              )}
              {isProvider && booking.status === 'IN_PROGRESS' && (
                <button onClick={() => updateStatus('COMPLETED')} className="btn-primary">Mark as complete</button>
              )}
              {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                <button onClick={() => updateStatus('CANCELLED')} className="btn-danger">Cancel</button>
              )}
            </div>
          </div>

          {/* Review */}
          {isCustomer && booking.status === 'COMPLETED' && !booking.review && (
            <div className="card">
              <h3 className="font-bold mb-4">Leave a review</h3>
              <div className="flex gap-2 mb-4">
                {[1,2,3,4,5].map((s) => (
                  <button key={s} onClick={() => setRating(s)} className={`text-2xl transition-transform hover:scale-110 ${s <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                ))}
              </div>
              <textarea
                className="input resize-none mb-3"
                rows={3}
                placeholder="Tell others about your experience…"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
              <button onClick={submitReview} className="btn-primary">Submit review</button>
            </div>
          )}

          {booking.review && (
            <div className="card bg-yellow-50 border-yellow-200">
              <h3 className="font-bold mb-2">Your review</h3>
              <div className="text-yellow-400 text-xl mb-1">{'★'.repeat(booking.review.rating)}{'☆'.repeat(5 - booking.review.rating)}</div>
              {booking.review.comment && <p className="text-gray-700 text-sm">{booking.review.comment}</p>}
            </div>
          )}

          {/* Job Photos */}
          {(() => {
            const photos = booking.jobPhotos ? JSON.parse(booking.jobPhotos) : [];
            const canUpload = isProvider && ['IN_PROGRESS', 'COMPLETED'].includes(booking.status);
            if (photos.length === 0 && !canUpload) return null;
            return (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Job Photos</h3>
                  {canUpload && (
                    <>
                      <button
                        onClick={() => photoInputRef.current?.click()}
                        disabled={uploadingPhotos}
                        className="btn-primary text-sm py-1.5 px-4"
                      >
                        {uploadingPhotos ? 'Uploading…' : '📷 Add Photos'}
                      </button>
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={uploadJobPhotos}
                      />
                    </>
                  )}
                </div>
                {photos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {photos.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noreferrer">
                        <img
                          src={url}
                          alt={`Job photo ${i + 1}`}
                          className="w-full h-28 object-cover rounded-xl hover:opacity-90 transition-opacity"
                        />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No photos yet. Add photos to show the work done.</p>
                )}
              </div>
            );
          })()}
        </div>

        {/* Chat */}
        <div className="lg:col-span-2">
          <div className="card flex flex-col h-[400px] sm:h-[520px]">
            <div className="flex items-center gap-3 mb-4 border-b pb-3">
              {isCustomer ? (
                <Avatar avatarUrl={booking.provider?.user?.avatarUrl} firstName={booking.provider?.user?.firstName} lastName={booking.provider?.user?.lastName} size="sm" />
              ) : (
                <Avatar avatarUrl={booking.customer?.avatarUrl} firstName={booking.customer?.firstName} lastName={booking.customer?.lastName} size="sm" />
              )}
              <h3 className="font-bold">
                Chat with {isCustomer ? booking.provider?.user?.firstName : booking.customer?.firstName}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
              {messages.length === 0 && (
                <p className="text-center text-gray-400 text-sm mt-8">No messages yet. Say hello!</p>
              )}
              {messages.map((m) => {
                const isMine = m.senderId === user?.id;
                return (
                  <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      isMine ? 'bg-brand-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    }`}>
                      {!isMine && (
                        <p className="font-bold text-xs mb-1 opacity-70">{m.sender?.firstName}</p>
                      )}
                      {m.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                className="input flex-1 text-sm"
                placeholder="Type a message…"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
              />
              <button type="submit" className="btn-primary px-4 py-2">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
