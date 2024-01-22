
import { Routes, Route, Link } from "react-router-dom";
import Leaderboard from "./Leaderboard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios-config/axios'


const MastermindLeaderboard: React.FC = () => {
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function getPlayersList() {
            try {
                const res = await axios.get(`ranking/mastermind`);
                if (res.status === 200) setPlayers(res.data);
            } catch (e) {
                navigate("/");
            }
        }
        getPlayersList();
    }, [ navigate ])
    

    return (
        <div className="rankings-container">
            <Leaderboard winnersList={players} gameName={"Mastermind"}/>
        </div>
    );
}

export default MastermindLeaderboard;