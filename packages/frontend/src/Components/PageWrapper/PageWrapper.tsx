import React from 'react';
import './PageWrapper.scss';

interface PageWrapperProps {
    children: React.ReactNode;
}

const PageWrapper: React.FunctionComponent<PageWrapperProps> = ({ children }) => {
    return <div className="PageWrapper">{children}</div>;
};

export default PageWrapper;
