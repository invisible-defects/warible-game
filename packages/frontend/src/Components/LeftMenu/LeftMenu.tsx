import React, { useState } from 'react';
import './LeftMenu.scss';
import { ReactComponent as Logo } from '../../Assets/Svg/logo.svg';
import { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useMetaMask } from 'metamask-react';

const LeftMenu: React.FunctionComponent = () => {
    const [time, setTime] = useState<string>();
    const [active, setActive] = useState<boolean>(false);
    const { status, connect } = useMetaMask();

    localStorage.removeItem('fromGame');

    useEffect(() => {
        setInterval(() => {
            setTime(new Date().toLocaleString());
        }, 1000);
    }, []);

    const OnClick = () => {
        setActive(true);
        connect();
    };

    return status === 'connected' ? (
        <Redirect to="/" />
    ) : (
        <div className="LeftMenu-container">
            <div className="LeftMenu-title">Welcome to Warible</div>
            <div className="LeftMenu-time">{time?.substr(12, 999)}</div>
            <div className="LeftMenu-logo">
                <Logo />
            </div>

            <div className={`LeftMenu-button ${active ? 'active' : ''}`} onClick={OnClick}>
                <div className="text">connect metamask</div>
                {active ? (
                    <img src="button-icons/metamask-convex.png" alt="MetaMask logo" />
                ) : (
                    <img src="button-icons/metamask-concave.png" alt="MetaMask logo" />
                )}
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
