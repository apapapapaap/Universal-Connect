import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { GeolocationProvider } from './context/GeolocationContext';
import AppRouter from './router';

function App() {
  return (
    <AuthProvider>
      <GeolocationProvider>
        <AppRouter />
      </GeolocationProvider>
    </AuthProvider>
  );
}

export default App;
