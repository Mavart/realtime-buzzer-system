export interface BuzzerState {
  locked: boolean;
  winner: string | null;
  timestamp: number | null;
  mode: 'single' | 'multiple';
  responses: BuzzerResponse[];
}

export interface BuzzerEvents {
  buzz: (playerName: string) => void;
  reset: () => void;
  setMode: (mode: 'single' | 'multiple') => void;
}

export interface ConnectedUser {
  id: string;
  name: string;
  joinedAt: number;
}

export interface BuzzerResponse {
  playerName: string;
  timestamp: number;
}