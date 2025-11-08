import React from 'react';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
        
        <Card>
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-6">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.full_name}</h2>
              <p className="text-gray-600">@{user?.username}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Location</h3>
              <p className="text-gray-600">{user?.city}</p>
              {user?.latitude && user?.longitude && (
                <p className="text-sm text-gray-500 mt-1">
                  {parseFloat(user.latitude).toFixed(4)}, {parseFloat(user.longitude).toFixed(4)}
                </p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Account Type</h3>
              <p className="text-gray-600 capitalize">{user?.role || 'Student'}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
