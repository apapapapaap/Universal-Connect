import api from './api';

export const eventService = {
  async getEvents(lat, lng, radius = 500, type = null) {
    const params = { lat, lng, radius };
    if (type) params.type = type;
    
    const response = await api.get('/events', { params });
    return response.data;
  },

  async getEventById(id) {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  async createEvent(eventData) {
    const response = await api.post('/events', eventData);
    return response.data;
  },
};
