import React from 'react';
import { useState } from 'react';
import Collections from '../../Components/GameStates/Collections/Collections';
// import GameView from '../../Components/Game/GameView';
import Home from '../../Components/GameStates/Home/Home';
import Header from '../../Components/Header/Header';
import { CardType } from '../../Components/HeaderButton/HeaderButton';
import './Game.scss';

const Game: React.FunctionComponent = () => {
    const [currentState, setCurrentState] = useState<CardType>('Home');

    const SetState = (type: CardType) => {
        setCurrentState(type);
    };

    const GetCurrentComponent = (type: CardType) => {
        switch (type) {
            case 'Home':
                return <Home />;

            case 'Deck':
                return <Collections />;
        }
    };

    return (
        <div className="GamePage">
            <Header setState={SetState} currentState={currentState} />
            <div className="GameWrapper">
                {/* <GameView /> */}
                {GetCurrentComponent(currentState)}
            </div>
        </div>
    );
};

export default Game;
