import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import RidesPage from './pages/RidesPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import ProfileView from './pages/dashboard/ProfileView';
import RideAlertsView from './pages/dashboard/RideAlertsView';
import BookingsView from './pages/dashboard/BookingsView';
import MyRidesView from './pages/dashboard/MyRidesView';
import CreateRideView from './pages/dashboard/CreateRideView';
import RequestsView from './pages/dashboard/RequestsView';
import VehicleView from './pages/dashboard/VehicleView';
import MessagesView from './pages/dashboard/MessagesView';
import NotificationsView from './pages/dashboard/NotificationsView';
import AdminView from './pages/dashboard/AdminView';
import ProtectedRoute from './components/ProtectedRoute';
import AuthModal from './components/AuthModal';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/rides" element={<RidesPage />} />
          <Route path="/rides/:id" element={<RidesPage />} />

          {/* Unified Nested Dashboard Shell */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Overview / Home Tab */}
            <Route index element={<DashboardOverview />} />

            {/* Passenger Routes */}
            <Route path="bookings" element={<BookingsView />} />
            <Route path="alerts" element={<RideAlertsView />} />
            <Route path="find" element={<Navigate to="/rides" replace />} />
            <Route path="find-rides" element={<Navigate to="/rides" replace />} />

            {/* Driver Routes */}
            <Route
              path="my-rides"
              element={
                <ProtectedRoute allowedRoles={['DRIVER', 'ADMIN']}>
                  <MyRidesView />
                </ProtectedRoute>
              }
            />
            <Route
              path="create-ride"
              element={
                <ProtectedRoute allowedRoles={['DRIVER', 'ADMIN']}>
                  <CreateRideView />
                </ProtectedRoute>
              }
            />
            <Route
              path="requests"
              element={
                <ProtectedRoute allowedRoles={['DRIVER', 'ADMIN']}>
                  <RequestsView />
                </ProtectedRoute>
              }
            />
            <Route
              path="vehicle"
              element={
                <ProtectedRoute allowedRoles={['DRIVER', 'ADMIN']}>
                  <VehicleView />
                </ProtectedRoute>
              }
            />

            {/* Shared Authenticated Routes */}
            <Route path="messages" element={<MessagesView />} />
            <Route path="notifications" element={<NotificationsView />} />
            <Route path="profile" element={<ProfileView />} />

            {/* Admin Only Routes */}
            <Route
              path="admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminView section="users" />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/rides"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminView section="rides" />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/reports"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminView section="reports" />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/announcements"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminView section="announcements" />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/analytics"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminView section="analytics" />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Direct Role Redirects */}
          <Route path="/driver" element={<Navigate to="/dashboard" replace />} />
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Authentication Modal */}
        <AuthModal />
      </AuthProvider>
    </BrowserRouter>
  );
}
