import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageWrapper from './Components/PageWrapper/PageWrapper';
import GameMenu from './Pages/GameMenu/Game';
import StartPage from './Pages/StartPage/StartPage';

const App: React.FunctionComponent = () => {
    return (
        <PageWrapper>
            <Switch>
                <Route exact path="/" component={GameMenu} />
                <Route exact path="/login" component={StartPage} />
            </Switch>
        </PageWrapper>
    );
};

export default App;
