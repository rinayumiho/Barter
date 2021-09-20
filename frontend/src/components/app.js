import React from 'react';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Switch } from 'react-router-dom';
import MainPageContainer from './main/main_page_container';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';
import { Route } from 'react-router';


const App = () => (
  <Switch>
    <Route exact path="/" component={MainPageContainer} />
    <AuthRoute exact path="/login" component={LoginFormContainer} />
    <AuthRoute exact path="/signup" component={SignupFormContainer} />
    <Route path='/home' component={MainPageContainer} />
  </Switch>
)

export default App;