import React from 'react';

import Game from './game';

import './GameView.scss';

class GameView extends React.Component {
    gameRef = React.createRef<HTMLDivElement>();
    game: Game | undefined;

    componentDidMount() {
        this.game = new Game();
        this.gameRef.current?.appendChild(this.game.app.view);
        this.game.init();
    }

    render() {
        return <div className="GameView" ref={this.gameRef} />;
    }
}

export default GameView;
