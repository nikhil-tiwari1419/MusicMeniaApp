export const trackUserAction = (trackId, actionType, extraData = {}) => {
  const timestamp = new Date().toISOString();
  
  let scoreWeight = 0;
  switch (actionType) {
    case 'LIKE':
      scoreWeight = 3;
      break;
    case 'UNLIKE':
      scoreWeight = -3;
      break;
    case 'PLAY':
      scoreWeight = 1;
      break;
    case 'QUICK_SKIP':
      scoreWeight = -1;
      break;
    default:
      scoreWeight = 0;
  }

  // Proper modular logging service format
  console.log(`[EWMA SERVICE] [${timestamp}] Track: ${trackId} | Action: ${actionType} | Weight: ${scoreWeight}`, extraData);
  
  return {
    trackId,
    actionType,
    scoreWeight,
    timestamp
  };
};