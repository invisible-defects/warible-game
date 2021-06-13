import React from 'react';
import './HeaderButton.scss';
import { ReactComponent as Home } from '../../Assets/Svg/HeaderButtonsIcons/logo-active.svg';
import { ReactComponent as HomeIdle } from '../../Assets/Svg/HeaderButtonsIcons/logo-idle.svg';
import { ReactComponent as Deck } from '../../Assets/Svg/HeaderButtonsIcons/cards-active.svg';
import { ReactComponent as DeckIdle } from '../../Assets/Svg/HeaderButtonsIcons/cards-idle.svg';
import { ReactComponent as Inventary } from '../../Assets/Svg/HeaderButtonsIcons/chest-active.svg';
import { ReactComponent as InventaryIdle } from '../../Assets/Svg/HeaderButtonsIcons/chest-idle.svg';
import { ReactComponent as Fight } from '../../Assets/Svg/HeaderButtonsIcons/swords-active.svg';
import { ReactComponent as FightIdle } from '../../Assets/Svg/HeaderButtonsIcons/swords-idle.svg';

export type CardType = 'Home' | 'Deck' | 'Inventary' | 'Fight';

interface HeaderButtonProps {
    active: boolean;
    type: CardType;
    setState: (type: CardType) => void;
}

const HeaderButton: React.FunctionComponent<HeaderButtonProps> = ({ active, type, setState }) => {
    const GetCardIcon = (cardType: CardType) => {
        switch (cardType) {
            case 'Home':
                if (active) {
                    return <Home />;
                } else {
                    return <HomeIdle />;
                }

            case 'Deck':
                if (active) {
                    return <Deck />;
                } else {
                    return <DeckIdle />;
                }

            case 'Inventary':
                if (active) {
                    return <Inventary />;
                } else {
                    return <InventaryIdle />;
                }

            case 'Fight':
                if (active) {
                    return <Fight />;
                } else {
                    return <FightIdle />;
                }
        }
    };

    return (
        <div className={`HeaderButton ${active ? 'active' : ''}`} onClick={() => setState(type)}>
            <div className="HeaderButton-icon">{GetCardIcon(type)}</div>
        </div>
    );
};

export default HeaderButton;
