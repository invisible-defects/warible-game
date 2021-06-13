import React from 'react';
import './CollectionsHeaderItem.scss';

interface CollectionsHeaderItemProps {
    num: number;
    active: boolean;
    onClick: () => void;
}

const CollectionsHeaderItem: React.FunctionComponent<CollectionsHeaderItemProps> = ({ num, active, onClick }) => {
    return (
        <div className={`CollectionsHeaderItem ${active ? 'active' : ''}`} onClick={onClick}>
            {num}
        </div>
    );
};

export default CollectionsHeaderItem;
