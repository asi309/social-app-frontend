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

  const apiLogoutHandler = async () => {
    try {
      await api.get('/logout');
      return false;
    } catch (error) {
      if (error.response.status === 401) {
        return false;
      }
    }
  };

  const apiUserCheckHandler = async (user_id) => {
    try {
      const response = await api.get(`/user/${user_id}`);
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const defaultAuthHandler = () => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      apiLogoutHandler().then((res) => {
        console.log(res);
        return res;
      });
    }
    apiUserCheckHandler(user_id).then(res => {
      console.log(res);
      return res;
    })
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
