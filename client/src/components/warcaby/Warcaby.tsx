import React, { useEffect, useState } from 'react';
import './Warcaby.scss';
import { Board } from './board/Board';
import BoardModel from '../../models/BoardModel';
import { Labels } from 'models/Labels';
//import { PlayerModel } from 'models/PlayerModel';
import PlayerModel from 'models/PlayerModel';

function Warcaby() {
    const [board, setBoard] = useState<BoardModel>(new BoardModel());
    const [winner, setWiner] = useState<PlayerModel>();
    const [lightPlayer, setLightPlayer] = useState<PlayerModel>(new PlayerModel(Labels.Light, 0));
    const [darkPlayer, setDarkPlayer] = useState<PlayerModel>(new PlayerModel(Labels.Dark, 0));
    const [currentPlayer, setCurrentPlayer] = useState<PlayerModel>(lightPlayer);

    const restart = () => {
        const newBoard = new BoardModel();
        newBoard.createCells();
        newBoard.addFigures();
        setBoard(newBoard);
        setCurrentPlayer(lightPlayer);
    };

    const changePlayer = () => {
        //console.log(lightPlayer.amountOfDefeatedPiecies, darkPlayer.amountOfDefeatedPiecies);
        setCurrentPlayer(currentPlayer.label === Labels.Light ? darkPlayer : lightPlayer);
    }

    const changeKillCount = () => {
        currentPlayer.label === Labels.Light ? 
            setLightPlayer(new PlayerModel(Labels.Light, lightPlayer.amountOfDefeatedPiecies+1)) : 
            setDarkPlayer(new PlayerModel(Labels.Dark, darkPlayer.amountOfDefeatedPiecies+1));
        //setCurrentPlayer(currentPlayer);
        //console.log(lightPlayer.amountOfDefeatedPiecies, darkPlayer.amountOfDefeatedPiecies);
        //currentPlayer.increaseKillCount();
    }

    useEffect(() => {
        //console.log(lightPlayer.amountOfDefeatedPiecies, darkPlayer.amountOfDefeatedPiecies);
        if(lightPlayer.amountOfDefeatedPiecies === 2) setWiner(lightPlayer);
        if(darkPlayer.amountOfDefeatedPiecies === 2) setWiner(darkPlayer);
        const updatedBoard = board.updateBoard();
        setBoard(updatedBoard);
    }, [lightPlayer, darkPlayer])

    useEffect(() => {
        restart();
    }, []);

    return (
        <div className="warcaby">
            { winner ? (
                <h1>{winner.label} player wins!</h1>
            ) : (
                <div>
                    <div className='player'>Current player: {currentPlayer.label}</div>
                    <Board 
                        board={board} 
                        onSetBoard={setBoard}
                        currentPlayer={currentPlayer}
                        onChangePlayer={changePlayer}
                        onChangeKillCount={changeKillCount}
                    />
                </div>
            )}
        </div>
    );
}

export default Warcaby;