import React from 'react';
import './Lootboxes.scss';
import LootboxesImg from '../../../Assets/Images/lootboxes.png';
import { useHistory } from 'react-router-dom';

const Lootboxes: React.FunctionComponent = () => {
    const history = useHistory();

    return (
        <div className="Lootboxes">
            <img className="Lootboxes-container" src={LootboxesImg} alt="ui" onClick={() => history.push('/loot')} />
        </div>
    );
};

export default Lootboxes;
