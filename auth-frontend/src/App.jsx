import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import RoleRoute from "./components/RoleRoute";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserArea from "./pages/UserArea";
import AdminArea from "./pages/AdminArea";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Guest-only routes */}
        <Route element={<GuestRoute />}>
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* User + Admin Role Routes */}
          <Route element={<RoleRoute allowedRoles={["user", "admin"]} />}>
            <Route path="/user-area" element={<UserArea />} />
          </Route>

          {/* Admin Only Role Routes */}
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin-area" element={<AdminArea />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
