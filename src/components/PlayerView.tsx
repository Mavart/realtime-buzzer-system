import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { socket, buzzerEvents } from '../socket';
import type { BuzzerState } from '../types/buzzer';

const PlayerView = () => {
  const [buzzerState, setBuzzerState] = useState<BuzzerState>({
    locked: false,
    winner: null,
    timestamp: null,
    mode: 'single',
    responses: []
  });
  const [playerName, setPlayerName] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [hasBuzzed, setHasBuzzed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    socket.on('buzzerState', (newState: BuzzerState) => {
      setBuzzerState(newState);
      // Only reset hasBuzzed when the buzzer is reset
      if (newState.responses.length === 0) {
        setHasBuzzed(false);
      }
    });
    return () => {
      socket.off('buzzerState');
    };
  }, []);

  const handleBuzz = () => {
    if (!hasBuzzed && isReady) {
      buzzerEvents.buzz(playerName);
      setHasBuzzed(true);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          console.error('Error playing sound:', error);
        });
      }
    }
  };

  const handleSubmitName = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      setIsReady(true);
      socket.emit('playerJoin', { playerName: playerName.trim() });
    }
  };

  const getPlayerRank = () => {
    const index = buzzerState.responses.findIndex(r => r.playerName === playerName);
    return index !== -1 ? index + 1 : null;
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <form onSubmit={handleSubmitName} className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Enter Your Name</h2>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="Your name"
            required
          />
          <button
            type="submit"
            className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Join Game
          </button>
        </form>
      </div>
    );
  }

  const isButtonDisabled = hasBuzzed || (buzzerState.mode === 'single' && buzzerState.locked);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/buzzer.mp3" type="audio/mpeg" />
      </audio>
      
      <div className="text-white text-xl mb-8">
        Playing as: <span className="font-bold">{playerName}</span>
      </div>
      
      <button
        onClick={handleBuzz}
        disabled={isButtonDisabled}
        className={`
          relative w-48 h-48 rounded-full shadow-lg transition-all duration-200
          ${isButtonDisabled
            ? 'bg-red-500 cursor-not-allowed' 
            : 'bg-green-500 hover:bg-green-400 active:scale-95'
          }
          flex items-center justify-center
        `}
      >
        <Bell className="w-24 h-24 text-white" />
      </button>

      <div className="mt-8 text-center text-white">
        {buzzerState.mode === 'single' && buzzerState.locked && (
          <div className="text-xl">
            {buzzerState.winner === playerName 
              ? "You buzzed first! 🎉" 
              : `${buzzerState.winner} buzzed first!`}
          </div>
        )}
        {buzzerState.mode === 'multiple' && hasBuzzed && (
          <div className="text-xl">
            {`You buzzed in position #${getPlayerRank()}!`}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerView;