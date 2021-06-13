import React, { useState } from 'react';
import './Collections.scss';
import CollectionsHeaderItem from './CollectionsHeaderItem';

const Collections: React.FunctionComponent = () => {
    const [active, setActive] = useState<number>(1);

    return (
        <div className="Collections">
            <div className="Collections-header">
                {[...new Array(12)].map((data, index) => (
                    <CollectionsHeaderItem
                        num={index + 1}
                        active={active === index + 1}
                        onClick={() => setActive(index + 1)}
                    />
                ))}
            </div>
            <div className="Collections-container">
                <div className="Collections-cards">
                    {[...new Array(7)].map((data, index) => (
                        <div className="Collections-card">
                            <img src={`/game/card-f-${active}.png`} alt="card" />
                            <div className="Collections-card-text">
                                Replace with an NFT. C’mon, it’s not that expensive.
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Collections;
