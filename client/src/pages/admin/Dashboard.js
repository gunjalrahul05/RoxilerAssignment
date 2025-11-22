import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { useGetAdminDashboardQuery } from '../../store/api/dashboardApi';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import StarIcon from '@mui/icons-material/Star';

const Dashboard = () => {
  const { data, isLoading, error } = useGetAdminDashboardQuery();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography color="error">
          Error loading dashboard data: {error.data?.message || 'Something went wrong'}
        </Typography>
      </Box>
    );
  }

  const stats = data?.data || { totalUsers: 0, totalStores: 0, totalRatings: 0 };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Total Users */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#f5f5f5'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PeopleIcon sx={{ color: '#1976d2', mr: 1 }} />
              <Typography variant="h6" color="textSecondary">
                Total Users
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
              {stats.totalUsers}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Total Stores */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#f5f5f5'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StoreIcon sx={{ color: '#388e3c', mr: 1 }} />
              <Typography variant="h6" color="textSecondary">
                Total Stores
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
              {stats.totalStores}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Total Ratings */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#f5f5f5'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StarIcon sx={{ color: '#f57c00', mr: 1 }} />
              <Typography variant="h6" color="textSecondary">
                Total Ratings
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
              {stats.totalRatings}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Summary Card */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Overview
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" paragraph>
                Welcome to the Store Rating Application Admin Dashboard. As a System Administrator, you have the following capabilities:
              </Typography>
              <Typography variant="body1" component="div">
                <ul>
                  <li>Add new stores, normal users, and admin users</li>
                  <li>View and manage all users in the system</li>
                  <li>View and manage all stores in the system</li>
                  <li>Monitor overall system statistics</li>
                </ul>
              </Typography>
              <Typography variant="body1" paragraph>
                Use the navigation menu to access different sections of the admin panel.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
