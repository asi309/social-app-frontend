import React, { useContext, useEffect, useState } from 'react';

import api from '../../services/api';
import { UserContext } from '../../user-context';

import './Login.css';

export default function Login({ history }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {
    isLoggedIn,
    setIsLoggedIn,
    themePref,
    lightStyle,
    darkStyle,
  } = useContext(UserContext);

  useEffect(() => {
    if (isLoggedIn) {
      history.push('/home');
    }
  }, [isLoggedIn]);

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/login', { email, password });
      const user_id = response.data.user_id || false;

      if (user_id) {
        localStorage.setItem('user_id', user_id);
        setIsLoggedIn(true);
        history.push('/home');
      }
    } catch (error) {
      setError(true);
      const message = error.response ? error.response.data.message : false;
      if (message) {
        setErrorMessage(message);
      } else {
        setErrorMessage('ERROR: Cannot perform the operation');
      }
      setTimeout(() => {
        setError(false);
        setErrorMessage('');
      }, 2500);
    }
  };

  return (
    <div
      className="container"
      style={themePref === 'dark' ? darkStyle : lightStyle}
    >
      <div className="container--login">
        <form
          style={
            themePref === 'dark'
              ? { backgroundColor: 'rgba(31, 70, 110, 0.804)' }
              : {}
          }
        >
          <div className="title">Login</div>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            autoFocus={true}
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            style={
              themePref === 'dark'
                ? { backgroundColor: 'rgba(42, 70, 98, 0.704)', color: 'white' }
                : {}
            }
          />
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            style={
              themePref === 'dark'
                ? { backgroundColor: 'rgba(42, 70, 98, 0.704)', color: 'white' }
                : {}
            }
          />
          <button onClick={loginHandler}>Login</button>
          {error ? <div className="alert">{errorMessage}</div> : ''}
        </form>
      </div>
    </div>
  );
}
