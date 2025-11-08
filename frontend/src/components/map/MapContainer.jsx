import React from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to update map center
const MapUpdater = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.setView([center.latitude, center.longitude], map.getZoom());
    }
  }, [center, map]);
  return null;
};

const MapContainer = ({ center, events = [], onMarkerClick }) => {
  if (!center) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  // Create custom icons for different event types
  const getEventIcon = (type) => {
    const colors = {
      'Hackathon': '#9333ea',
      'Workshop': '#3b82f6',
      'Meetup': '#10b981',
      'AI Workshop': '#f97316',
    };
    
    return L.divIcon({
      className: 'custom-icon',
      html: `<div style="background-color: ${colors[type] || '#6b7280'}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  return (
    <LeafletMap
      center={[center.latitude, center.longitude]}
      zoom={10}
      style={{ height: '100%', width: '100%', borderRadius: '8px' }}
    >
      <MapUpdater center={center} />
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User location marker */}
      <Marker position={[center.latitude, center.longitude]}>
        <Popup>
          <div className="text-center">
            <strong>Your Location</strong>
          </div>
        </Popup>
      </Marker>

      {/* Event markers */}
      {events.map((event) => (
        <Marker
          key={event.id}
          position={[parseFloat(event.latitude), parseFloat(event.longitude)]}
          icon={getEventIcon(event.type)}
          eventHandlers={{
            click: () => onMarkerClick && onMarkerClick(event),
          }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-bold text-sm mb-1">{event.title}</h3>
              <p className="text-xs text-gray-600 mb-2">{event.type}</p>
              <p className="text-xs text-gray-600">{event.city}</p>
              {event.distance && (
                <p className="text-xs text-blue-600 font-semibold mt-1">
                  {event.distance.toFixed(1)} km away
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </LeafletMap>
  );
};

export default MapContainer;
