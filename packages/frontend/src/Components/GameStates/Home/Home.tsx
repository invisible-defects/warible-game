import React from 'react';
import './Home.scss';
import { ReactComponent as Cards } from '../../../Assets/Svg/cards.svg';
import { ReactComponent as Chest } from '../../../Assets/Svg/Chest.svg';
import { ReactComponent as Swords } from '../../../Assets/Svg/big-swords.svg';

const Home: React.FunctionComponent = () => {
    return (
        <div className="Home">
            <div className="Home-container">
                <div className="Home-icon">
                    <Cards />
                </div>
                <div className="Home-bottom">
                    <div className="Home-title">Collection</div>
                    <div className="Home-description">
                        Scroll through your card collection and build a deck to destroy your enemies with
                    </div>
                </div>
            </div>
            <div className="Home-container">
                <div className="Home-icon">
                    <Chest />
                </div>
                <div className="Home-bottom">
                    <div className="Home-title">Lootboxes</div>
                    <div className="Home-description">
                        Open smart-contract based lootboxes to obtain powerful fighters for your deck
                    </div>
                </div>
            </div>
            <div className="Home-container">
                <div className="Home-icon">
                    <Swords />
                </div>
                <div className="Home-bottom">
                    <div className="Home-title">Matchmaking</div>
                    <div className="Home-description">
                        Test your skills and decks against other players in a tough 1v1 match
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
