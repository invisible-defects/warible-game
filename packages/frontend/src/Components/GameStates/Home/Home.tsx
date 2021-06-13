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
            </div>
            <div className="Home-container">
                <div className="Home-icon">
                    <Chest />
                </div>
            </div>
            <div className="Home-container">
                <div className="Home-logo">
                    <Swords />
                </div>
            </div>
        </div>
    );
};

export default Home;
