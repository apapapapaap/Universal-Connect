import { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { useGeolocation } from './useGeolocation';

export const useEvents = (radius = 500, type = null) => {
  const { location } = useGeolocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!location) return;

      setLoading(true);
      try {
        const response = await eventService.getEvents(
          location.latitude,
          location.longitude,
          radius,
          type
        );
        setEvents(response.data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [location, radius, type]);

  return { events, loading, error };
};
