import React, { useEffect, useState } from 'react';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import "./Leaderboard.scss";

interface Player {
  id: number;
  username: string;
  averageScore: number;
}

interface LeaderboardProps {
  winnersList: Player[];
  gameName: String;
}


const Leaderboard: React.FC<LeaderboardProps> = ({winnersList, gameName}) => {

  return (
    <div className='leaderboard'>
      <h2 className="leaderboard-title">{gameName} Leaderboard</h2>
      <ul className='players-list'>
        {winnersList.map((player, id) => (
          <li key={id} className="player-container">
              {id === 0 && (
                <div className="player-info">
                  <span className="medal-emoji">
                      🥇 
                  </span>
                  <span>
                    {player.username} - {player.averageScore.toFixed(1)} points
                  </span>
                </div>
              )}
              {id === 1 && (
                <div className="player-info">
                  <span className="medal-emoji">
                    🥈 
                  </span>
                  <span>
                    {player.username} - {player.averageScore.toFixed(1)} points
                  </span>
                </div>
              )}
              {id === 2 && (
                <div className="player-info">
                  <span className="medal-emoji">
                    🥉 
                  </span>
                  <span>
                    {player.username} - {player.averageScore.toFixed(1)} points
                  </span>
                </div>
              )}
              {id > 2 && (
                <div className="player-info">
                  <EmojiEventsIcon className="trophy-icon" />
                  <span className="losers-place">{id + 1}.</span>
                  <span>
                    {player.username} - {player.averageScore.toFixed(1)} points
                  </span>
                </div>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
