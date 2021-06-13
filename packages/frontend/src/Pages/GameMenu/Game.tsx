import React from 'react';
import { useState } from 'react';
import Collections from '../../Components/GameStates/Collections/Collections';
import GameView from '../../Components/Game/GameView';
import Home from '../../Components/GameStates/Home/Home';
import Header from '../../Components/Header/Header';
import { CardType } from '../../Components/HeaderButton/HeaderButton';
import './Game.scss';

const Game: React.FunctionComponent = () => {
    const flag = localStorage.getItem('fromGame');
    const [currentState, setCurrentState] = useState<CardType>(flag === 'true' ? 'Fight' : 'Home');

    const SetState = (type: CardType) => {
        localStorage.removeItem('fromGame');
        setCurrentState(type);
    };

    const GetCurrentComponent = (type: CardType) => {
        switch (type) {
            case 'Home':
                return <Home />;

            case 'Deck':
                return <Collections />;

            case 'Fight':
                return <GameView />;
        }
    };

    return (
        <div className="GamePage">
            <Header setState={SetState} currentState={currentState} />
            <div className="GameWrapper">{GetCurrentComponent(currentState)}</div>
        </div>
    );
};

export default Game;
