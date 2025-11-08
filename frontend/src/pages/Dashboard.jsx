import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import EventCard from '../components/events/EventCard';
import MapContainer from '../components/map/MapContainer';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';
import { useGeolocation } from '../hooks/useGeolocation';
import { useEvents } from '../hooks/useEvents';
import { RADIUS_OPTIONS, EVENT_TYPES } from '../utils/constants';
import socketService from '../services/socketService';

const Dashboard = () => {
  const { user } = useAuth();
  const { location, loading: locationLoading } = useGeolocation();
  const [selectedRadius, setSelectedRadius] = useState(500);
  const [selectedType, setSelectedType] = useState(null);
  const { events, loading: eventsLoading } = useEvents(selectedRadius, selectedType);
  const [liveEvents, setLiveEvents] = useState([]);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // Update live events when events change
  useEffect(() => {
    setLiveEvents(events);
  }, [events]);

  // Setup Socket.IO for real-time updates
  useEffect(() => {
    socketService.connect();

    // Listen for new events
    socketService.on('newEvent', (data) => {
      console.log('🔔 New event received:', data);
      
      // Show notification
      setNotification(`New event: ${data.data.title}`);
      setTimeout(() => setNotification(null), 5000);

      // Add new event to the list if it's nearby
      if (location && data.data) {
        const newEvent = data.data;
        
        // Calculate distance
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          parseFloat(newEvent.latitude),
          parseFloat(newEvent.longitude)
        );
        
        newEvent.distance = distance;

        // Add to events if within radius
        if (!selectedRadius || distance <= selectedRadius) {
          setLiveEvents(prev => [newEvent, ...prev]);
        }
      }
    });

    return () => {
      socketService.off('newEvent');
    };
  }, [location, selectedRadius]);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleMarkerClick = (event) => {
    navigate(`/events/${event.id}`);
  };

  if (locationLoading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Real-time Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          🔔 {notification}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.full_name}! 👋
          </h1>
          <p className="text-gray-600">
            Discover events near you in {user?.city}
          </p>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live updates enabled
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Radius Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance
              </label>
              <select
                value={selectedRadius || ''}
                onChange={(e) => setSelectedRadius(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {RADIUS_OPTIONS.map((option) => (
                  <option key={option.label} value={option.value || ''}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type
              </label>
              <select
                value={selectedType || ''}
                onChange={(e) => setSelectedType(e.target.value || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Map and Events Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Event Map</h2>
            <div className="h-96">
              {location && (
                <MapContainer
                  center={location}
                  events={liveEvents}
                  onMarkerClick={handleMarkerClick}
                />
              )}
            </div>
          </div>

          {/* Events List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Nearby Events ({liveEvents.length})
              </h2>
            </div>

            {eventsLoading ? (
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            ) : liveEvents.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">No events found in your area.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Try increasing the distance filter
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {liveEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/explore')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="text-3xl mb-2">🗺️</div>
            <h3 className="font-semibold text-lg mb-1">Explore Events</h3>
            <p className="text-sm text-gray-600">Browse all events on the map</p>
          </button>

          <button
            onClick={() => navigate('/team-builder')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-semibold text-lg mb-1">Build a Team</h3>
            <p className="text-sm text-gray-600">AI-powered teammate matching</p>
          </button>

          <button
            onClick={() => navigate('/meetups')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-semibold text-lg mb-1">Local Meetups</h3>
            <p className="text-sm text-gray-600">Find students near you</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
