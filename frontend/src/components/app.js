import React from 'react';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Switch } from 'react-router-dom';
import MainPageContainer from './main/main_page_container';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';
import ProfilePageContainer from './profile/profile_container';
import PostShow from './post/post_show_container';
import SellContainer from './sell/sell_container';
import { Route } from 'react-router';
import PostIndex from './post/post_index_container';
import SearchResultsContainer from "./search_bar/search_results_container";


const App = () => (
  <Switch>
    <Route exact path="/" component={MainPageContainer} />
    <AuthRoute exact path="/login" component={LoginFormContainer} />
    <AuthRoute exact path="/signup" component={SignupFormContainer} />
    <ProtectedRoute exact path="/profile" component={ProfilePageContainer} />
    <Route path='/home' component={MainPageContainer} />
    <Route path='/sell' component={SellContainer} />
    <Route path='/posts/:postid' component={PostShow} />
    <Route path='/posts' component={PostIndex} />
    <Route path= '/search/results' component={SearchResultsContainer}/>
  </Switch>
)

export default App;