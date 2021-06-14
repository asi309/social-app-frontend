import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/RegisterUser';
import Home from './pages/Home';
import PostDetails from './pages/PostDetails';
import Profile from './pages/Profile';
import searchResults from './components/searchResults';
import Nav from './components/Nav';
import Footer from './components/Footer';

export default function Routes() {
  return (
    <BrowserRouter>
      <Nav />
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/home" component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/p/:postId" component={PostDetails} />
        <Route path="/u/:userId" component={Profile} />
        <Route path="/search" component={searchResults} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}
