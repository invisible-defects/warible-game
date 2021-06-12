import React from 'react';
import './HeaderButton.scss';
import { ReactComponent as Home } from '../../Assets/Svg/HeaderButtonsIcons/logo.svg';
import { ReactComponent as Deck } from '../../Assets/Svg/HeaderButtonsIcons/cards.svg';
import { ReactComponent as Inventary } from '../../Assets/Svg/HeaderButtonsIcons/chest.svg';
import { ReactComponent as Fight } from '../../Assets/Svg/HeaderButtonsIcons/swords.svg';

type CardType = 'Home' | 'Deck' | 'Inventary' | 'Fight';

interface HeaderButtonProps {
    active: boolean;
    type: CardType;
}

const GetCardIcon = (cardType: CardType) => {
    switch (cardType) {
        case 'Home':
            return <Home />;

        case 'Deck':
            return <Deck />;

        case 'Inventary':
            return <Inventary />;

        case 'Fight':
            return <Fight />;
    }
};

const HeaderButton: React.FunctionComponent<HeaderButtonProps> = ({ active, type }) => {
    return (
        <div className={`HeaderButton ${active ? 'active' : ''}`}>
            <div className="HeaderButton-icon">{GetCardIcon(type)}</div>
        </div>
    );
};

export default HeaderButton;
