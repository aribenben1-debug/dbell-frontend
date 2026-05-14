import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.js';

import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import BookingWizard from './pages/booking/BookingWizard.jsx';
import BookingDetail from './pages/booking/BookingDetail.jsx';
import MyBookings from './pages/booking/MyBookings.jsx';
import ProviderDashboard from './pages/provider/Dashboard.jsx';
import ProviderProfile from './pages/provider/Profile.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminProviders from './pages/admin/Providers.jsx';
import AdminBookings from './pages/admin/Bookings.jsx';
import SupportPage from './pages/Support.jsx';
import CustomerProfile from './pages/customer/Profile.jsx';

function RequireAuth({ children, role }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Customer */}
        <Route path="book" element={<RequireAuth role="CUSTOMER"><BookingWizard /></RequireAuth>} />
        <Route path="bookings" element={<RequireAuth><MyBookings /></RequireAuth>} />
        <Route path="bookings/:id" element={<RequireAuth><BookingDetail /></RequireAuth>} />
        <Route path="support" element={<RequireAuth><SupportPage /></RequireAuth>} />
        <Route path="profile" element={<RequireAuth role="CUSTOMER"><CustomerProfile /></RequireAuth>} />

        {/* Provider */}
        <Route path="provider/dashboard" element={<RequireAuth role="PROVIDER"><ProviderDashboard /></RequireAuth>} />
        <Route path="provider/profile" element={<RequireAuth role="PROVIDER"><ProviderProfile /></RequireAuth>} />

        {/* Admin */}
        <Route path="admin" element={<RequireAuth role="ADMIN"><AdminDashboard /></RequireAuth>} />
        <Route path="admin/providers" element={<RequireAuth role="ADMIN"><AdminProviders /></RequireAuth>} />
        <Route path="admin/bookings" element={<RequireAuth role="ADMIN"><AdminBookings /></RequireAuth>} />
      </Route>
    </Routes>
  );
}
