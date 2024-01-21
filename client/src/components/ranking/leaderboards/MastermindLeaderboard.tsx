
import { Routes, Route, Link } from "react-router-dom";
import Leaderboard from "./Leaderboard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios-config/axios'


const MastermindLeaderboard: React.FC = () => {
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

    const users = [{
        "id": 312312,
        "averageScore": 3309.422,
        "username": "filip"
        },
        {
        "id": 312313,
        "averageScore": 1430.713123,
        "username": "michał"
        },
        {
        "id": 312311,
        "averageScore": 1345.4324,
        "username": "paweł"
        },
        {
        "id": 312315,
        "averageScore": 1124.3123,
        "username": "anton"
        }]

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