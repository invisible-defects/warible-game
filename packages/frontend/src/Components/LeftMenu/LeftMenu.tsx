import React from 'react';
import './LeftMenu.scss';
import { ReactComponent as Logo } from '../../Assets/Svg/logo.svg';
import { ReactComponent as Animal } from '../../Assets/Svg/animal.svg';

const LeftMenu: React.FunctionComponent = () => {
    return (
        <div className="LeftMenu-container">
            <div className="LeftMenu-title">Welcome to Warible</div>
            <div className="LeftMenu-time">12:43:10</div>
            <div className="LeftMenu-logo">
                <Logo />
            </div>

            <div className="LeftMenu-button">
                <div className="text">connect metamask</div>
                <Animal />
            </div>

            <div className="LeftMenu-policy">
                by continuing you agree with terms of use
                <br />
                and Warible privacy policy
            </div>

            <div className="LeftMenu-footer">
                <div className="version">v0.1</div>
                <div className="course">1 ETH ⇆ 2327.61 USD</div>
            </div>
        </div>
    );
};

export default LeftMenu;
