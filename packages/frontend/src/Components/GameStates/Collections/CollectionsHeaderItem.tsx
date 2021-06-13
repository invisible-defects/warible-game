import React from 'react';
import './CollectionsHeaderItem.scss';

interface CollectionsHeaderItemProps {
    num: number;
    active: boolean;
}

const CollectionsHeaderItem: React.FunctionComponent<CollectionsHeaderItemProps> = ({ num, active }) => {
    return <div className={`CollectionsHeaderItem ${active ? 'active' : ''}`}>{num}</div>;
};

export default CollectionsHeaderItem;
