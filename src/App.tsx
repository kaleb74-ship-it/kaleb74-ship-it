import React, { useState } from 'react';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { StoreProvider } from './store';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] selection:bg-violet-500/30 selection:text-violet-200">
      {isAuthenticated ? (
        <StoreProvider>
          <Dashboard onLogout={handleLogout} />
        </StoreProvider>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

