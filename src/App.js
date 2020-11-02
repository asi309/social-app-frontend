import React from 'react';

import { ContextWrapper } from './user-context';
import Routes from './routes';

import './App.css';

function App() {
  return (
    <ContextWrapper>
      <div className="App">
        <Routes />
      </div>
    </ContextWrapper>
  );
}

export default App;
