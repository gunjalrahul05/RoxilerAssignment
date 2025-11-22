
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  return `${formatDate(dateString)} ${formatTime(dateString)}`;
};

export const formatRating = (rating) => {
  if (!rating) return 'No Rating';
  
  const ratingValue = parseFloat(rating);
  return ratingValue.toFixed(1);
};
