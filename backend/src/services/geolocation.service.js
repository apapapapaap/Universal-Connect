const { pool } = require('../config/database');
const { buildDistanceQuery } = require('../utils/haversine');

class GeolocationService {
  /**
   * Get events sorted by distance from user location
   */
  async getEventsByDistance(userLat, userLng, radiusKm = null, eventType = null) {
    let query = `
      SELECT 
        e.*,
        ${buildDistanceQuery()}
      FROM events e
      WHERE 1=1
    `;
    
    const params = [userLat, userLng];
    let paramIndex = 3;

    // Add radius filter
    if (radiusKm) {
      query += ` AND (6371 * acos(
        cos(radians($1)) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians($2)) + 
        sin(radians($1)) * sin(radians(latitude))
      )) <= $${paramIndex}`;
      params.push(radiusKm);
      paramIndex++;
    }

    // Add event type filter
    if (eventType) {
      query += ` AND type = $${paramIndex}`;
      params.push(eventType);
    }

    query += ` ORDER BY distance ASC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Get nearby users within radius
   */
  async getNearbyUsers(userLat, userLng, radiusKm, excludeUserId = null) {
    let query = `
      SELECT 
        u.id, u.full_name, u.username, u.city, u.university_id,
        ${buildDistanceQuery()}
      FROM users u
      WHERE (6371 * acos(
        cos(radians($1)) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians($2)) + 
        sin(radians($1)) * sin(radians(latitude))
      )) <= $3
    `;
    
    const params = [userLat, userLng, radiusKm];

    if (excludeUserId) {
      query += ` AND u.id != $4`;
      params.push(excludeUserId);
    }

    query += ` ORDER BY distance ASC`;

    const result = await pool.query(query, params);
    return result.rows;
  }
}

module.exports = new GeolocationService();
