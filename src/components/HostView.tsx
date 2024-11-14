import React, { useEffect, useState } from 'react';
import { RotateCcw, Bell, Users, Settings } from 'lucide-react';
import { socket, buzzerEvents } from '../socket';
import type { BuzzerState, ConnectedUser } from '../types/buzzer';

const HostView = () => {
  const [buzzerState, setBuzzerState] = useState<BuzzerState>({
    locked: false,
    winner: null,
    timestamp: null,
    mode: 'single',
    responses: []
  });
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);

  useEffect(() => {
    socket.on('buzzerState', setBuzzerState);
    socket.on('connectedUsers', setConnectedUsers);
    
    return () => {
      socket.off('buzzerState');
      socket.off('connectedUsers');
    };
  }, []);

  const resetBuzzer = () => {
    buzzerEvents.reset();
  };

  const toggleMode = () => {
    const newMode = buzzerState.mode === 'single' ? 'multiple' : 'single';
    buzzerEvents.setMode(newMode);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3 
    });
  };

  const formatTimeDifference = (timestamp: number, baseTimestamp: number) => {
    const diff = timestamp - baseTimestamp;
    if (diff === 0) return '+0.000s';
    const seconds = (diff / 1000).toFixed(3);
    return `+${seconds}s`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-xl max-w-4xl w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Host Panel</h2>
          <div className="flex gap-3">
            <button
              onClick={toggleMode}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              <Settings className="w-4 h-4" />
              {buzzerState.mode === 'single' ? 'Single Response' : 'Multiple Responses'}
            </button>
            <button
              onClick={resetBuzzer}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className={`w-6 h-6 ${buzzerState.locked ? 'text-red-400' : 'text-green-400'}`} />
                <span className="text-white">Buzzer Status:</span>
              </div>
              <span className={`font-semibold ${buzzerState.locked ? 'text-red-400' : 'text-green-400'}`}>
                {buzzerState.locked ? 'Locked' : 'Ready'}
              </span>
            </div>

            {buzzerState.mode === 'single' && buzzerState.locked && buzzerState.winner && (
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-white">
                  <div className="font-semibold mb-2">First to buzz:</div>
                  <div className="text-2xl font-bold text-green-400">{buzzerState.winner}</div>
                  {buzzerState.timestamp && (
                    <div className="text-sm text-white/60 mt-2">
                      at {formatTime(buzzerState.timestamp)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {buzzerState.mode === 'multiple' && buzzerState.responses.length > 0 && (
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-white">
                  <div className="font-semibold mb-4">Response Order:</div>
                  <div className="space-y-3">
                    {buzzerState.responses.map((response, index) => {
                      const firstTimestamp = buzzerState.responses[0].timestamp;
                      const timeDiff = formatTimeDifference(response.timestamp, firstTimestamp);
                      
                      return (
                        <div 
                          key={response.playerName} 
                          className="flex items-center justify-between bg-white/5 p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-white/60 ${index === 0 ? 'text-green-400' : ''}`}>
                              #{index + 1}
                            </span>
                            <span className="font-medium text-white">{response.playerName}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-sm ${index === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                              {timeDiff}
                            </span>
                            <span className="text-sm text-white/60">
                              {formatTime(response.timestamp)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Connected Players ({connectedUsers.length})</h3>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {connectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between bg-white/5 p-3 rounded-lg"
                  >
                    <span className="text-white font-medium">{user.name}</span>
                    <span className="text-xs text-white/60">
                      {new Date(user.joinedAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                {connectedUsers.length === 0 && (
                  <div className="text-white/60 text-center py-4">
                    No players connected
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostView;