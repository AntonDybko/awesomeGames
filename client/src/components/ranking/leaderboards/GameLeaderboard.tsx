import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios-config/axios';
import Leaderboard from "./Leaderboard";

const GameLeaderboard: React.FC<{ gameName: string }> = ({ gameName }) => {
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function getPlayersList() {
            try {
                const res = await axios.get(`ranking/${gameName}`);
                if (res.status === 200) setPlayers(res.data);
                console.log(res.data);
            } catch (e) {
                navigate("/");
            }
        }
        getPlayersList();
    }, [gameName, navigate]);

    return (
        <div className="rankings-container">
            <Leaderboard winnersList={players} gameName={gameName}/>
        </div>
    );
};

export default GameLeaderboard;
