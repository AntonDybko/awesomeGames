import React, { useState } from 'react';
import "./Leaderboard.scss";
import Pagination from '@mui/material/Pagination';

interface Player {
  id: number;
  username: string;
  averageScore: number;
}

interface LeaderboardProps {
  winnersList: Player[];
  gameName: String;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ winnersList, gameName }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = winnersList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(winnersList.length / itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className='leaderboard'>
      <table className='players-table'>
        <thead className='table-header'>
          <tr className="header-names">
            <th>Standing</th>
            <th>Player</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody className='table-data'>
          {currentItems.map((player, index) => (
              <tr key={index} className="player-container">
                <td className="player-ranking">
                  {currentPage === 1 && index === 0 && <span className="medal-emoji">🥇</span>}
                  {currentPage === 1 && index === 1 && <span className="medal-emoji">🥈</span>}
                  {currentPage === 1 && index === 2 && <span className="medal-emoji">🥉</span>}
                  {(currentPage !== 1 || index > 2) && <span>#{indexOfFirstItem + index + 1}</span>}
                </td>
                <td className='player-info'>{player.username}</td>
                <td className='player-info'>{player.averageScore.toFixed(0)} points</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className='pagination'>
        <Pagination count={totalPages} onChange={handlePageChange} showFirstButton showLastButton />
      </div>
    </div>
  );
};

export default Leaderboard;
