import React, { useState } from 'react';
import './LeftMenu.scss';
import { ReactComponent as Logo } from '../../Assets/Svg/logo.svg';
import { ReactComponent as Animal } from '../../Assets/Svg/animal.svg';
import { ReactComponent as AnimalDark } from '../../Assets/Svg/animal-dark.svg';
import { useEffect } from 'react';
import MetaMaskOnboarding from '@metamask/onboarding';
import { useHistory } from 'react-router-dom';

const LeftMenu: React.FunctionComponent = () => {
    const [time, setTime] = useState<string>();
    const [active, setActive] = useState<boolean>(false);
    const [accounts, setAccounts] = React.useState([]);
    const onboarding = React.useRef<MetaMaskOnboarding>();

    const history = useHistory();

    useEffect(() => {
        setInterval(() => {
            setTime(new Date().toLocaleString());
        }, 1000);
    }, []);

    // .useEffect(() => {
    //     if (!onboarding.current) {
    //       onboarding.current = new MetaMaskOnboarding();
    //     }
    //   }, []);

    const OnClick = () => {
        history.push('/');
    };

    return (
        <div className="LeftMenu-container">
            <div className="LeftMenu-title">Welcome to Warible</div>
            <div className="LeftMenu-time">{time?.substr(12, 999)}</div>
            <div className="LeftMenu-logo">
                <Logo />
            </div>

            <div
                className={`LeftMenu-button ${active ? 'active' : ''}`}
                onPointerDown={() => setActive(true)}
                onPointerUp={() => setActive(false)}
            >
                <div className="text">connect metamask</div>
                {active ? <Animal /> : <AnimalDark />}
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
