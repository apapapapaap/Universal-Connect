import api from './api';

export const aiService = {
  async getTeamRecommendations(radiusKm = 500) {
    const response = await api.post('/ai/team-builder', { radius_km: radiusKm });
    return response.data;
  },

  async getEventRecommendations(lat, lng) {
    const response = await api.post('/ai/recommendations', { lat, lng });
    return response.data;
  },
};
