import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/RegisterUser';
import Home from './pages/Home';
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
        <Route path="/p/:postId" component={Home} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}
