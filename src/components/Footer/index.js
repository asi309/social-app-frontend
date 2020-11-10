import React, { useContext } from 'react';

import { UserContext } from '../../user-context';

import './Footer.css';

export default function Footer() {
  const { themePref, lightStyle, darkStyle } = useContext(UserContext);

  return (
    <footer style={themePref === 'dark' ? darkStyle : lightStyle}>
      <p>&copy; Asidipta Chaudhuri</p>
    </footer>
  );
}