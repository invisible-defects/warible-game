import React from 'react';
import HeaderButton from '../HeaderButton/HeaderButton';
import './Header.scss';

const Header: React.FunctionComponent = () => {
    return (
        <div className="Header">
            <HeaderButton active type="Home" />
            <HeaderButton active={false} type="Deck" />
            <HeaderButton active={false} type="Inventary" />
            <HeaderButton active={false} type="Fight" />
        </div>
    );
};

export default Header;
