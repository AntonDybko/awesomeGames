import React, { useEffect, useState } from 'react';
//import './Warcaby.scss';
import { Board } from './board/Board';
import BoardModel from '../../models/BoardModel';
import { Color } from '../../models/Color'

function Warcaby() {
    const [board, setBoard] = useState<BoardModel>(new BoardModel(Color.None, Color.None));
    const player = Color.Light //here will be value from db
    const oponent = Color.Dark //here will be value from db
    const restart = () => {
        const newBoard = new BoardModel(player, oponent);
        newBoard.createCells();
        setBoard(newBoard);
    };

    useEffect(() => {
        restart();
    }, []);

    return (
        <div className="app">
            <Board board={board} onSetBoard={setBoard} playerColor={player} oponentColor={oponent}/>
        </div>
    );
}

export default Warcaby;