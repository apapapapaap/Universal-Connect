import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { geolocationService } from '../services/geolocationService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    username: '',
    city: '',
    latitude: 0,
    longitude: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const getLocation = async () => {
    setGettingLocation(true);
    try {
      const position = await geolocationService.getCurrentPosition();
      setFormData((prev) => ({
        ...prev,
        latitude: position.latitude,
        longitude: position.longitude,
      }));
      setError('');
    } catch (err) {
      setError('Unable to get your location. Please try again or enter coordinates manually.');
      console.error('Geolocation error:', err);
    } finally {
      setGettingLocation(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.latitude || !formData.longitude) {
      setError('Please get your location or enter coordinates manually.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">UniVerse Connect</h1>
          <p className="text-gray-600">Join the global student community</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />

            <Input
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@university.edu"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password (min 6 characters)"
              required
            />

            <Input
              label="City"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Bangalore"
              required
            />

            {/* Location Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={getLocation}
                disabled={gettingLocation}
              >
                {gettingLocation ? (
                  <span className="flex items-center justify-center">
                    <Loader size="sm" /> Getting location...
                  </span>
                ) : formData.latitude && formData.longitude ? (
                  `✓ Location set (${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)})`
                ) : (
                  '📍 Get My Location'
                )}
              </Button>
              <p className="mt-1 text-xs text-gray-500">
                We need your location to show nearby events and students
              </p>
            </div>

            {/* Manual coordinates input (optional) */}
            {formData.latitude === 0 && formData.longitude === 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded text-sm text-blue-800">
                <p className="font-semibold mb-1">Don't want to share location?</p>
                <p className="text-xs">Click "Get My Location" button above or use default coordinates</p>
              </div>
            )}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? <Loader size="sm" /> : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
