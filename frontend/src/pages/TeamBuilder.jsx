import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { aiService } from '../services/aiService';

const TeamBuilder = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [radius, setRadius] = useState(500);

  const generateRecommendations = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await aiService.getTeamRecommendations(radius);
      setRecommendations(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Team Builder 🤖
          </h1>
          <p className="text-gray-600">
            Let AI analyze nearby students and recommend the perfect teammates for your project
          </p>
        </div>

        {/* Settings Card */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Search Settings</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Radius
            </label>
            <select
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
              <option value={250}>250 km</option>
              <option value={500}>500 km</option>
              <option value={1000}>1000 km</option>
            </select>
          </div>

          <Button onClick={generateRecommendations} disabled={loading}>
            {loading ? (
              <span className="flex items-center">
                <Loader size="sm" /> Analyzing...
              </span>
            ) : (
              '✨ Generate Team Recommendations'
            )}
          </Button>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Recommended Teammates
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  {/* Score Badge */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                        {rec.full_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{rec.full_name || 'Unknown'}</h3>
                        {rec.distance_km && (
                          <p className="text-sm text-gray-500">{rec.distance_km} km away</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {rec.score || 0}% Match
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 italic">
                      "{rec.reasoning || 'Good potential teammate'}"
                    </p>
                  </div>

                  {/* Skills */}
                  {rec.complementary_skills && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Complementary Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {rec.complementary_skills.split(',').slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button variant="outline" fullWidth>
                    View Profile
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && recommendations.length === 0 && !error && (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Ready to Find Teammates?</h3>
            <p className="text-gray-600 mb-6">
              Click the button above to let AI analyze nearby students and recommend the best matches for your team
            </p>
          </Card>
        )}

        {/* How it Works */}
        <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How AI Team Matching Works</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-semibold mb-2">1. Analyze Profiles</h3>
              <p className="text-sm text-gray-600">
                AI analyzes skills, location, and preferences of nearby students
              </p>
            </div>
            
            <div>
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">2. Match Skills</h3>
              <p className="text-sm text-gray-600">
                Finds complementary skills that would strengthen your team
              </p>
            </div>
            
            <div>
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-semibold mb-2">3. Get Recommendations</h3>
              <p className="text-sm text-gray-600">
                Receive ranked recommendations with match scores and reasoning
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamBuilder;
