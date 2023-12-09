import { Routes, Route, Navigate } from "react-router-dom";
import Home from 'components/home/Home';
import Games from 'components/games/Games';
import Ranking from 'components/ranking/Ranking';
import Profile from 'components/profile/Profile';
import MastermindPage from 'components/mastermind-page/MastermindPage';
import Mastermind from 'components/mastermind/Mastermind';
import TicTacToePage from 'components/tictactoe-page/TicTacToePage';
import TicTacToe from 'components/tictactoe/TicTacToe';
import LoginPage from "components/profile/LoginPage";
import SignUpPage from "components/profile/SignUpPage";
import Logout from "components/profile/Logout";
import SessionPersistence from "components/other/SessionPersistence";
import RequireAuth from "components/other/RequireAuth";

export const Routing: React.FC = () => {
  return (
    <Routes>
      <Route element={<SessionPersistence />}>
        <Route path="/" element={<Home />} />
        <Route element={<RequireAuth />}>
          <Route path="/games" element={<Games />} />
          <Route path="/games/mastermind" element={<MastermindPage />} />
          <Route path="/games/mastermind/:id" element={<Mastermind />} />
          <Route path="/games/tictactoe" element={<TicTacToePage />} />
          <Route path="/games/tictactoe/:id" element={<TicTacToe />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/profile/:userId" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

