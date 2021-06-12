import React from 'react';
import HeaderButton from '../HeaderButton/HeaderButton';
import './Header.scss';

const Header: React.FunctionComponent = () => {
    return (
        <div className="Header">
            <HeaderButton />
            <HeaderButton />
            <HeaderButton />
            <HeaderButton />
        </div>
    );
};

export default Header;
