import React from 'react';
import './PageWrapper.scss';

interface PageWrapperProps {
    children: React.ReactNode;
}

const PageWrapper: React.FunctionComponent<PageWrapperProps> = ({ children }) => {
    return (
        <div>
            <video className="PageWrapper" autoPlay loop muted src="videos/bg-vid.mp4" />
            <div className="PageWrapper-content">{children}</div>
        </div>
    );
};

export default PageWrapper;
