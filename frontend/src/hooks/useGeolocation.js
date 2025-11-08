import { useContext } from 'react';
import { GeolocationContext } from '../context/GeolocationContext';

export const useGeolocation = () => {
  const context = useContext(GeolocationContext);
  if (!context) {
    throw new Error('useGeolocation must be used within GeolocationProvider');
  }
  return context;
};
