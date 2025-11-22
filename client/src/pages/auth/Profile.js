import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Alert 
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useUpdatePasswordMutation } from '../../store/api/authApi';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [updatePassword, { isLoading, isSuccess, error }] = useUpdatePasswordMutation();

  const validationSchema = Yup.object({
    currentPassword: Yup.string()
      .required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(16, 'Password must be at most 16 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required')
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await updatePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword
        }).unwrap();
        
        resetForm();
      } catch (err) {

      }
    }
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Profile Information
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">
            <strong>Name:</strong> {user?.name}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Email:</strong> {user?.email}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Role:</strong> {user?.role}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Address:</strong> {user?.address}
          </Typography>
        </Box>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>
        
        {isSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Password updated successfully
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.data?.message || 'Failed to update password. Please try again.'}
          </Alert>
        )}
        
        <Box component="form" onSubmit={formik.handleSubmit}>
          <TextField
            margin="normal"
            fullWidth
            name="currentPassword"
            label="Current Password"
            type="password"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
            helperText={formik.touched.currentPassword && formik.errors.currentPassword}
          />
          
          <TextField
            margin="normal"
            fullWidth
            name="newPassword"
            label="New Password"
            type="password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
            helperText={formik.touched.newPassword && formik.errors.newPassword}
          />
          
          <TextField
            margin="normal"
            fullWidth
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
