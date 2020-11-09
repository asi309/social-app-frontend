import React, { useContext, useState } from 'react';

import api from '../../services/api';
import { UserContext } from '../../user-context';

export default function Register({ history }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { setIsLoggedIn, themePref, darkStyle, lightStyle } = useContext(
    UserContext
  );

  const registerHandler = async (e) => {
    e.preventDefault();

    try {
      if (
        email !== '' &&
        password !== '' &&
        username !== '' &&
        firstName !== '' &&
        lastName !== ''
      ) {
        if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g)) {
          console.log('Herer');
          throw error;
        }
        const response = await api.post('/user/register', {
          username,
          email,
          firstName,
          lastName,
          password,
        });

        const user_id = response.data.user_id || false;

        if (user_id) {
          setIsLoggedIn(true);
          history.push('/home');
        }
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
          <div className="title">Signup</div>
          <input
            type="text"
            id="firstName"
            name="firstName"
            autoComplete="off"
            autoFocus={true}
            value={firstName}
            placeholder="Enter your first name"
            onChange={(e) => setFirstName(e.target.value)}
            style={
              themePref === 'dark'
                ? { backgroundColor: 'rgba(42, 70, 98, 0.704)', color: 'white' }
                : {}
            }
          />
          <input
            type="text"
            id="lastName"
            name="lastName"
            autoComplete="off"
            autoFocus={true}
            value={lastName}
            placeholder="Enter your last name"
            onChange={(e) => setLastName(e.target.value)}
            style={
              themePref === 'dark'
                ? { backgroundColor: 'rgba(42, 70, 98, 0.704)', color: 'white' }
                : {}
            }
          />
          <input
            type="text"
            id="username"
            name="username"
            autoComplete="off"
            autoFocus={true}
            value={username}
            placeholder="Choose your username"
            onChange={(e) => setUsername(e.target.value)}
            style={
              themePref === 'dark'
                ? { backgroundColor: 'rgba(42, 70, 98, 0.704)', color: 'white' }
                : {}
            }
          />
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
          <button onClick={registerHandler}>Signup</button>
          {error ? <div className="alert">{errorMessage}</div> : ''}
        </form>
      </div>
    </div>
  );
}
