import React, { useState, createContext, useEffect, useMemo } from 'react';

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
    const user = localStorage.getItem('user') || false;
    if (user) {
      return true;
    }
    return false;
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
  const [isLoggedIn, setIsLoggedIn] = useState(defaultAuthHandler());

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
