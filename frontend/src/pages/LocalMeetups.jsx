import React from 'react';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';

const LocalMeetups = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Local Meetups 👥
        </h1>
        
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
          <p className="text-gray-600">
            Find and organize local meetups with students near you
          </p>
        </Card>
      </div>
    </div>
  );
};

export default LocalMeetups;
