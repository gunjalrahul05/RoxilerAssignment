import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

const Profile = React.lazy(() => import('./pages/auth/Profile'));
const Unauthorized = React.lazy(() => import('./pages/auth/Unauthorized'));

const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = React.lazy(() => import('./pages/admin/Users'));
const AdminStores = React.lazy(() => import('./pages/admin/Stores'));

const UserStores = React.lazy(() => import('./pages/user/Stores'));
const UserStoreDetails = React.lazy(() => import('./pages/user/StoreDetails'));

const StoreOwnerDashboard = React.lazy(() => import('./pages/store-owner/Dashboard'));

const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    Loading...
  </div>
);

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/unauthorized" element={
          <React.Suspense fallback={<Loader />}>
            <MainLayout>
              <Unauthorized />
            </MainLayout>
          </React.Suspense>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <React.Suspense fallback={<Loader />}>
              <MainLayout>
                <Profile />
              </MainLayout>
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        {/* Admin routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <React.Suspense fallback={<Loader />}>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <React.Suspense fallback={<Loader />}>
              <MainLayout>
                <AdminUsers />
              </MainLayout>
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/stores" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <React.Suspense fallback={<Loader />}>
              <MainLayout>
                <AdminStores />
              </MainLayout>
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        {/* User routes */}
        <Route path="/user/stores" element={
          <ProtectedRoute allowedRoles={['USER']}>
            <React.Suspense fallback={<Loader />}>
              <MainLayout>
                <UserStores />
              </MainLayout>
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/user/stores/:id" element={
          <ProtectedRoute allowedRoles={['USER']}>
            <React.Suspense fallback={<Loader />}>
              <MainLayout>
                <UserStoreDetails />
              </MainLayout>
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        {/* Store Owner routes */}
        <Route path="/store-owner/dashboard" element={
          <ProtectedRoute allowedRoles={['STORE_OWNER']}>
            <React.Suspense fallback={<Loader />}>
              <MainLayout>
                <StoreOwnerDashboard />
              </MainLayout>
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        {/* Catch all - replace with 404 page */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
