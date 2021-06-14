import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { UserContext } from '../user-context';
import SearchIcon from './icons/SearchIcon';

import './search.css';

export default function SearchBar() {
  const [search, setSearch] = useState('');
  const history = useHistory();

  const { themePref, lightStyle, darkStyle } = useContext(UserContext);

  const searchHandler = () => {
    history.push({ pathname: '/search', state: { search } });
  };

  return (
    <div
      className="search-container"
      style={themePref === 'dark' ? darkStyle : lightStyle}
    >
      <input
        type="text"
        id="search-bar"
        value={search}
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
        style={
          themePref === 'dark'
            ? { backgroundColor: 'transparent', color: 'white' }
            : {}
        }
      />
      <button className="search-btn" onClick={() => searchHandler()}>
        <SearchIcon style={themePref === 'dark' ? darkStyle : lightStyle} />
      </button>
    </div>
  );
}
