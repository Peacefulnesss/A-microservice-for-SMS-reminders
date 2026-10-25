import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from './components/AuthLayout.jsx';
import Layout from './components/Layout.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import Bookings from './pages/Bookings.jsx';
import Extend from './pages/Extend.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Notifications from './pages/Notifications.jsx';
import Register from './pages/Register.jsx';
import Rooms from './pages/Rooms.jsx';

export default function App() {
  return (
    <Routes>
      {/* Открытые страницы: без сайдбара */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Закрытые страницы: только после входа */}
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="extend" element={<Extend />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="rooms" element={<Rooms />}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
