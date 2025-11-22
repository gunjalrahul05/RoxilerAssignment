import React from 'react';
import { 
  Box, 
  Rating as MuiRating, 
  Typography, 
  Button 
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

//rating
const Rating = ({ 
  value, 
  readOnly = false, 
  onChange, 
  userRating = null, 
  onSubmitRating,
  size = 'medium'
}) => {
  const [rating, setRating] = React.useState(userRating || 0);
  
  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSubmit = () => {
    if (onSubmitRating && rating > 0) {
      onSubmitRating(rating);
    }
  };
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
      <MuiRating
        name="rating"
        value={readOnly ? parseFloat(value) : rating}
        precision={1}
        readOnly={readOnly}
        onChange={handleRatingChange}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        size={size}
      />
      
      {!readOnly && (
        <>
          <Typography variant="body2" sx={{ ml: 1 }}>
            {rating > 0 ? `Your rating: ${rating}` : 'Select a rating'}
          </Typography>
          {onSubmitRating && (
            <Button 
              variant="contained" 
              color="primary" 
              size="small" 
              sx={{ ml: 2 }}
              onClick={handleSubmit}
              disabled={rating === 0}
            >
              {userRating ? 'Update' : 'Submit'}
            </Button>
          )}
        </>
      )}
    </Box>
  );
};

export default Rating;
