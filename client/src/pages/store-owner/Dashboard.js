import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Grid, Card, CardContent, CardHeader, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import { useGetStoreOwnerDashboardQuery } from '../../store/api/dashboardApi';

const Dashboard = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const { data: dashboardData, isLoading } = useGetStoreOwnerDashboardQuery({
    page: page + 1,
    limit: rowsPerPage
  });
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }
  
  if (!dashboardData) {
    return (
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Store Owner Dashboard
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography>No store information available. Please contact an administrator.</Typography>
        </Paper>
      </Container>
    );
  }
  
  const { store, raters, pagination } = dashboardData.data;
  
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Store Owner Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader 
              title="Store Rating" 
              titleTypographyProps={{ align: 'center' }} 
            />
            <CardContent>
              <Typography variant="h3" align="center">
                {Number(store.averageRating).toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Based on {store.totalRatings} ratings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Store Information" />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body1">
                  <strong>Name:</strong> {store.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {store.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> {store.address}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Users Who Rated Your Store
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell align="right">Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {raters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No ratings yet</TableCell>
                    </TableRow>
                  ) : (
                    raters.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.address}</TableCell>
                        <TableCell align="right">{user.rating_value}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={pagination.total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;