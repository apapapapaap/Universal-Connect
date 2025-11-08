const { GoogleGenerativeAI } = require('@google/generative-ai');
const { pool } = require('../config/database');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Team Builder logic
exports.teamBuilder = async (req, res) => {
  try {
    const { radius_km = 50 } = req.body;
    const userId = req.user.userId;
    const userResult = await pool.query(
      'SELECT id, full_name, city, latitude, longitude FROM users WHERE id = $1',
      [userId]
    );
    const currentUser = userResult.rows[0];

    const nearbyUsers = await pool.query(`
      SELECT 
        u.id, u.full_name, u.username, u.city,
        (6371 * acos(
          cos(radians($1)) * cos(radians(u.latitude)) * 
          cos(radians(u.longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(u.latitude))
        )) AS distance
      FROM users u
      WHERE u.id != $3
        AND (6371 * acos(
          cos(radians($1)) * cos(radians(u.latitude)) * 
          cos(radians(u.longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(u.latitude))
        )) <= $4
      ORDER BY distance ASC
      LIMIT 10
    `, [currentUser.latitude, currentUser.longitude, userId, radius_km]);

    if (nearbyUsers.rows.length === 0) {
      return res.json({ success: true, message: 'No nearby users found', data: [] });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a team matching AI for hackathons. Analyze these nearby users and recommend the top 5 teammates for ${currentUser.full_name}.

**Nearby Users:**
${nearbyUsers.rows.map((u, i) => `${i + 1}. ${u.full_name} - ${u.city} (${u.distance.toFixed(1)}km away)`).join('\n')}

Return a JSON array with exactly 5 recommendations (or less if fewer users available). Each should have:
- user_id (string)
- full_name (string)
- score (number 0-100)
- reasoning (string, brief)
- distance_km (number)

Format: Return ONLY a valid JSON array, no markdown.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    let recommendations = [];

    if (jsonMatch) {
      recommendations = JSON.parse(jsonMatch[0]);
    } else {
      recommendations = nearbyUsers.rows.slice(0, 5).map(u => ({
        user_id: u.id,
        full_name: u.full_name,
        score: Math.max(50, 100 - u.distance * 2),
        reasoning: `Located ${u.distance.toFixed(1)}km away in ${u.city}`,
        distance_km: parseFloat(u.distance.toFixed(1))
      }));
    }

    res.json({
      success: true,
      message: 'Team recommendations generated',
      data: recommendations
    });

  } catch (error) {
    console.error('AI Team Builder error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate team recommendations', 
      error: error.message 
    });
  }
};

// Event Recommendations logic
exports.eventRecommendations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { lat, lng } = req.body;

    const events = await pool.query(`
      SELECT 
        e.id, e.title, e.type, e.description, e.city,
        (6371 * acos(
          cos(radians($1)) * cos(radians(e.latitude)) * 
          cos(radians(e.longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(e.latitude))
        )) AS distance
      FROM events e
      WHERE e.start_at > NOW()
      ORDER BY distance ASC
      LIMIT 10
    `, [lat, lng]);

    if (events.rows.length === 0) {
      return res.json({ success: true, message: 'No upcoming events found', data: [] });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Recommend the top 3 events for a university student interested in technology and hackathons.

**Available Events:**
${events.rows.map((e, i) => `${i + 1}. ${e.title} (${e.type}) - ${e.city} - ${e.distance.toFixed(1)}km away\n   ${e.description}`).join('\n\n')}

Return a JSON array with top 3 recommendations. Each should have:
- event_id (string)
- title (string)
- match_score (number 0-100)
- reason (string, brief)

Format: Return ONLY a valid JSON array.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    let recommendations = [];

    if (jsonMatch) {
      recommendations = JSON.parse(jsonMatch[0]);
    } else {
      recommendations = events.rows.slice(0, 3).map(e => ({
        event_id: e.id,
        title: e.title,
        match_score: 85,
        reason: `${e.type} event in ${e.city}, ${e.distance.toFixed(1)}km away`
      }));
    }

    res.json({
      success: true,
      message: 'Event recommendations generated',
      data: recommendations
    });

  } catch (error) {
    console.error('AI Recommendations error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate recommendations', 
      error: error.message 
    });
  }
};
