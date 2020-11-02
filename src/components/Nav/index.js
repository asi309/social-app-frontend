import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
      localStorage.removeItem('user_id');
      await api.get('/logout');
      setIsLoggedIn(false);
    } catch (error) {
      return;
    }
  };

  return (
    <nav style={themePref === 'dark' ? darkStyle : lightStyle}>
      <p className="title">Social App</p>
      {/* {console.log(isLoggedIn)} */}
      {isLoggedIn ? (
        <ul>
          <li>
            <Link
              to="/home"
              style={themePref === 'dark' ? darkStyle : lightStyle}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              style={themePref === 'dark' ? darkStyle : lightStyle}
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/"
              style={themePref === 'dark' ? darkStyle : lightStyle}
              onClick={logoutHandler}
            >
              Logout
            </Link>
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
            <Link to="/" style={themePref === 'dark' ? darkStyle : lightStyle}>
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              style={themePref === 'dark' ? darkStyle : lightStyle}
            >
              Signup
            </Link>
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
