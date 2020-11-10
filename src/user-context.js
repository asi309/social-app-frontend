import React, { useState, createContext, useEffect } from 'react';

import api from './services/api';

export const UserContext = createContext();

export const ContextWrapper = (props) => {
  const lightStyle = {
    backgroundColor: 'white',
    color: 'black',
  };

  const darkStyle = {
    backgroundColor: 'rgb(21, 32, 43)',
    color: 'white',
  };

  const defaultAuthHandler = async () => {
    try {
      const response = await api.get('/check');
      if (response.status === 200) {
        localStorage.setItem('user_id', response.data.user_id);
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  const defaultThemeHandler = () => {
    const theme = localStorage.getItem('theme');
    if (!theme) {
      localStorage.setItem('theme', 'light');
      return 'light';
    }
    return theme;
  };

  const [themePref, setThemePref] = useState(defaultThemeHandler());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    defaultAuthHandler().then((res) => setIsLoggedIn(res));
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', themePref);
  }, [themePref]);

  const user = {
    isLoggedIn,
    setIsLoggedIn,
    themePref,
    setThemePref,
    lightStyle,
    darkStyle,
  };

  return (
    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
  );
};
