import React from 'react';
import HeaderButton, { CardType } from '../HeaderButton/HeaderButton';
import './Header.scss';

interface HeaderProps {
    setState: (type: CardType) => void;
    currentState: CardType;
}

const Header: React.FunctionComponent<HeaderProps> = ({ setState, currentState }) => {
    return (
        <div className="Header">
            <HeaderButton setState={setState} active={currentState === 'Home'} type="Home" />
            <HeaderButton setState={setState} active={currentState === 'Deck'} type="Deck" />
            <HeaderButton setState={setState} active={currentState === 'Inventary'} type="Inventary" />
            <HeaderButton setState={setState} active={currentState === 'Fight'} type="Fight" />
        </div>
    );
};

export default Header;
