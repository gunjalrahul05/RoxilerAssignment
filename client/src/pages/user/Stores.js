import React, { useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, 
  Button, Rating, Box, TextField, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetAllStoresQuery } from '../../store/api/storeApi';
import { useSubmitRatingMutation } from '../../store/api/ratingApi';
import { toast } from 'react-toastify';

const Stores = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    name: '',
    address: ''
  });
  
  const { data: storesData, isLoading, refetch } = useGetAllStoresQuery({
    page,
    limit: 8,
    ...filters
  });
  
  const [submitRating] = useSubmitRatingMutation();
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const handleRatingChange = async (storeId, newValue) => {
    try {
      await submitRating({
        store_id: storeId,
        rating_value: newValue
      }).unwrap();
      toast.success('Rating submitted successfully');
      refetch();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to submit rating');
    }
  };
  
  const handleViewDetails = (storeId) => {
    navigate(`/stores/${storeId}`);
  };
  
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Browse Stores
      </Typography>
      
      {/* Filters for searching accoding to name */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Store Name"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          size="small"
        />
        <TextField
          label="Location"
          name="address"
          value={filters.address}
          onChange={handleFilterChange}
          size="small"
        />
      </Box>
      
      {/* Stores Grid */}
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : storesData?.data.length === 0 ? (
        <Typography>No stores found</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {storesData?.data.map((store) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={store.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {store.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {store.address}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating 
                        value={parseFloat(store.average_rating)} 
                        precision={0.5} 
                        readOnly 
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({store.rating_count} ratings)
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">Your Rating:</Typography>
                      <Rating
                        value={store.user_rating || 0}
                        onChange={(event, newValue) => {
                          handleRatingChange(store.id, newValue);
                        }}
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleViewDetails(store.id)}>
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={storesData?.pagination?.totalPages || 1}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default Stores;