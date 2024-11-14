import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import PlayerView from './components/PlayerView';
import HostView from './components/HostView';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
        <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Bell className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-bold text-white">Buzzer System</span>
              </div>
              <div className="flex space-x-4">
                <Link to="/player" className="text-white hover:bg-white/10 px-3 py-2 rounded-md">
                  Player
                </Link>
                <Link to="/host" className="text-white hover:bg-white/10 px-3 py-2 rounded-md">
                  Host
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/player" element={<PlayerView />} />
          <Route path="/host" element={<HostView />} />
          <Route path="/" element={
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-white">
              <h1 className="text-4xl font-bold mb-8">Welcome to Buzzer System</h1>
              <div className="flex space-x-4">
                <Link
                  to="/player"
                  className="bg-white/20 hover:bg-white/30 transition-colors duration-200 px-6 py-3 rounded-lg font-semibold"
                >
                  Join as Player
                </Link>
                <Link
                  to="/host"
                  className="bg-white/20 hover:bg-white/30 transition-colors duration-200 px-6 py-3 rounded-lg font-semibold"
                >
                  Join as Host
                </Link>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;