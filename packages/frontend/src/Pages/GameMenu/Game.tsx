import React from 'react';
import GameView from '../../Components/Game/GameView';
import Header from '../../Components/Header/Header';
import './Game.scss';

const Game: React.FunctionComponent = () => {
    return (
        <div className="GamePage">
            <Header />
            <div className="GameWrapper">
                <GameView />
            </div>
        </div>
    );
};

export default Game;
