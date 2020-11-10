import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import api from '../../services/api';
import { UserContext } from '../../user-context';

import './Nav.css';

const Nav = () => {
  const {
    isLoggedIn,
    setIsLoggedIn,
    themePref,
    setThemePref,
    lightStyle,
    darkStyle,
  } = useContext(UserContext);

  const themeHandler = () => {
    if (themePref === 'dark') {
      setThemePref('light');
    } else {
      setThemePref('dark');
    }
  };

  const logoutHandler = async () => {
    try {
      await api.get('/logout');
      localStorage.removeItem('user_id');
      setIsLoggedIn(false);
    } catch (error) {
      return;
    }
  };

  return (
    <nav style={themePref === 'dark' ? darkStyle : lightStyle}>
      <p className="title">Social App</p>
      {isLoggedIn ? (
        <ul>
          <li>
            <NavLink
              to="/home"
              activeStyle={{ borderBottom: '5px solid #60b2ff' }}
              style={themePref === 'dark' ? darkStyle : lightStyle}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              activeStyle={{ borderBottom: '5px solid #60b2ff' }}
              style={themePref === 'dark' ? darkStyle : lightStyle}
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/"
              exact
              activeStyle={{ borderBottom: '5px solid #60b2ff' }}
              style={themePref === 'dark' ? darkStyle : lightStyle}
              onClick={logoutHandler}
            >
              Logout
            </NavLink>
          </li>
          <li id="theme-selector">
            <p>Dark Mode</p>
            <label className="toggle-switch">
              <input
                style={{ opacity: 0, height: 0, width: 0 }}
                type="checkbox"
                checked={themePref === 'dark'}
                onChange={themeHandler}
              />
              <span className="toggle-slider"></span>
            </label>
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <NavLink
              to="/"
              exact
              activeStyle={{borderBottom: '5px solid  #60b2ff'}}
              style={themePref === 'dark' ? darkStyle : lightStyle}
            >
              Login
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/register"
              activeStyle={{borderBottom: '5px solid  #60b2ff'}}
              style={themePref === 'dark' ? darkStyle : lightStyle}
            >
              Signup
            </NavLink>
          </li>
          <li id="theme-selector">
            <p>Dark Mode</p>
            <label className="toggle-switch">
              <input
                style={{ opacity: 0, height: 0, width: 0 }}
                type="checkbox"
                checked={themePref === 'dark'}
                onChange={themeHandler}
              />
              <span className="toggle-slider"></span>
            </label>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Nav;
