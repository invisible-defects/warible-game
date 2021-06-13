import { useMetaMask } from 'metamask-react';
import React from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import PageWrapper from './Components/PageWrapper/PageWrapper';
import GameMenu from './Pages/GameMenu/Game';
import StartPage from './Pages/StartPage/StartPage';

const App: React.FunctionComponent = () => {
    const { status } = useMetaMask();
    const location = useLocation();

    console.log(location.pathname);

    return status !== 'notConnected' || location.pathname === '/login' ? (
        <PageWrapper>
            <Switch>
                <Route exact path="/" component={GameMenu} />
                <Route exact path="/login" component={StartPage} />
            </Switch>
        </PageWrapper>
    ) : (
        <Redirect to="/login" />
    );
};

export default App;
