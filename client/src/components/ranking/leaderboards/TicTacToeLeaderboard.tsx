import { Routes, Route, Link } from "react-router-dom";
import Leaderboard from "./Leaderboard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios-config/axios'


const TicTacToeLeaderboard: React.FC = () => {
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

    const users = [{
        "id": 312312,
        "averageScore": 1001,
        "username": "filip"
        },
        {
        "id": 312313,
        "averageScore": 1002,
        "username": "filip2"
        },
        {
        "id": 312311,
        "averageScore": 1003,
        "username": "filip3"
        },
        {
        "id": 312315,
        "averageScore": 1004,
        "username": "filip4"
        }]


        
    useEffect(() => {
        async function getPlayersList() {
            try {
                const res = await axios.get(`ranking/tictactoe`);
                if (res.status === 200) setPlayers(res.data);
            } catch (e) {
                navigate("/");
            }
        }
        getPlayersList();
    }, [ navigate ])


    return (
        <div className="rankings-container">
            <Leaderboard winnersList={players} gameName={"TicTacToe"}/>
        </div>
    );
}

export default TicTacToeLeaderboard;