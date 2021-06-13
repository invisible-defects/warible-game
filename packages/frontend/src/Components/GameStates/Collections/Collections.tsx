import React, { useState } from 'react';
import './Collections.scss';
import CollectionsHeaderItem from './CollectionsHeaderItem';

const Collections: React.FunctionComponent = () => {
    const [active, setActive] = useState<number>(1);

    return (
        <div className="Collections">
            <div className="Collections-header">
                {[...new Array(12)].map((data, index) => (
                    <CollectionsHeaderItem num={index + 1} active={active === index + 1} />
                ))}
            </div>
        </div>
    );
};

export default Collections;
