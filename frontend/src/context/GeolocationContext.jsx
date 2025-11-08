import React, { createContext, useState, useEffect } from 'react';
import { geolocationService } from '../services/geolocationService';
import { DEFAULT_CENTER } from '../utils/constants';

export const GeolocationContext = createContext(null);

export const GeolocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const position = await geolocationService.getCurrentPosition();
        setLocation(position);
        setError(null);
      } catch (err) {
        console.error('Geolocation error:', err);
        setError(err.message);
        // Fallback to default location
        setLocation(DEFAULT_CENTER);
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
  };

  const value = {
    location,
    error,
    loading,
    updateLocation,
  };

  return (
    <GeolocationContext.Provider value={value}>
      {children}
    </GeolocationContext.Provider>
  );
};
