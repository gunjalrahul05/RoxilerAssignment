import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, Rating, Button, Dialog, 
  DialogActions, DialogContent, DialogTitle, Grid, Card, CardContent } from '@mui/material';
import { useGetStoreByIdQuery } from '../../store/api/storeApi';
import { useSubmitRatingMutation } from '../../store/api/ratingApi';
import { toast } from 'react-toastify';

const StoreDetails = () => {
  const { storeId } = useParams();
  const { data: store, isLoading } = useGetStoreByIdQuery(storeId);
  const [submitRating] = useSubmitRatingMutation();
  const [rateDialogOpen, setRateDialogOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  
  const handleRateStore = async () => {
    try {
      await submitRating({
        store_id: storeId,
        rating_value: ratingValue
      }).unwrap();
      toast.success('Rating submitted successfully');
      setRateDialogOpen(false);
    } catch (error) {
      toast.error(error.data?.message || 'Failed to submit rating');
    }
  };
  
  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }
  
  if (!store) {
    return <Typography>Store not found</Typography>;
  }
  
  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {store.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {store.address}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {store.email}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
          <Rating value={parseFloat(store.average_rating)} precision={0.5} readOnly />
          <Typography variant="body2" sx={{ ml: 1 }}>
            ({store.rating_count} ratings)
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          onClick={() => setRateDialogOpen(true)}
          sx={{ mt: 2 }}
        >
          Rate This Store
        </Button>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Your Rating
        </Typography>
        <Paper sx={{ p: 3 }}>
          {store.user_rating ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating value={store.user_rating} precision={0.5} readOnly />
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => setRateDialogOpen(true)}
                sx={{ ml: 2 }}
              >
                Update Rating
              </Button>
            </Box>
          ) : (
            <Typography>You haven't rated this store yet.</Typography>
          )}
        </Paper>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Store Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2">
                    <strong>Name:</strong> {store.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {store.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Address:</strong> {store.address}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Rating Summary
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2">
                    <strong>Average Rating:</strong> {store.average_rating}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Ratings:</strong> {store.rating_count}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Your Rating:</strong> {store.user_rating || 'Not rated yet'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      {/* Rate Dialog */}
      <Dialog open={rateDialogOpen} onClose={() => setRateDialogOpen(false)}>
        <DialogTitle>Rate {store.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
            <Typography gutterBottom>Select your rating:</Typography>
            <Rating
              size="large"
              value={ratingValue}
              onChange={(event, newValue) => {
                setRatingValue(newValue);
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRateStore} disabled={!ratingValue}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StoreDetails;