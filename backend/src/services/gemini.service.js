const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  /**
   * Get AI-powered team recommendations
   */
  async getTeamRecommendations(currentUser, nearbyUsers, hackathonDetails) {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
You are a team matching AI for hackathons. Analyze the following data and recommend the top 5 teammates for the user.

**Current User:**
- Skills: ${currentUser.skills.join(', ')}
- Experience Level: ${currentUser.experience || 'Intermediate'}
- City: ${currentUser.city}

**Hackathon:**
- Title: ${hackathonDetails.title}
- Type: ${hackathonDetails.type}
- Required Skills: ${hackathonDetails.required_skills || 'General'}

**Nearby Available Users:**
${nearbyUsers.map((u, i) => `
${i + 1}. ${u.full_name} (${u.distance.toFixed(1)}km away)
   - Skills: ${u.skills.join(', ')}
   - City: ${u.city}
`).join('\n')}

**Task:** Return a JSON array of the top 5 recommended teammates with:
1. user_id
2. score (0-100)
3. reasoning (brief explanation of why they're a good match)
4. complementary_skills (skills that complement the current user)

Format: Return ONLY valid JSON array, no markdown or extra text.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid AI response format');
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  /**
   * Get personalized event recommendations
   */
  async getEventRecommendations(userProfile, availableEvents) {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Analyze user profile and recommend top 3 events.

**User Profile:**
- Skills: ${userProfile.skills.join(', ')}
- Interests: ${userProfile.interests || 'Technology, Innovation'}
- Past Events: ${userProfile.past_events || 'None'}

**Available Events:**
${availableEvents.map((e, i) => `
${i + 1}. ${e.title} (${e.distance.toFixed(1)}km away)
   - Type: ${e.type}
   - Date: ${e.start_at}
   - Description: ${e.description}
`).join('\n')}

Return JSON array with: event_id, match_score (0-100), reason
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  }
}

module.exports = new GeminiService();
