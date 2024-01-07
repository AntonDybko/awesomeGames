import React, { useEffect, useState } from 'react';
import './Warcaby.scss';
import { Board } from './board/Board';
import BoardModel from '../../models/BoardModel';
import { Labels } from 'models/Labels';

function Warcaby() {
    const [board, setBoard] = useState<BoardModel>(new BoardModel());
    //const player = Color.Light //here will be value from db
    //const oponent = Color.Dark //here will be value from db
    const restart = () => {
        const newBoard = new BoardModel();
        newBoard.createCells();
        newBoard.addFigures();
        setBoard(newBoard);
    };

    useEffect(() => {
        restart();
    }, []);

    return (
        <div className="warcaby">
            <Board board={board} onSetBoard={setBoard}/>
        </div>
    );
}

export default Warcaby;