import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { UserContext } from '../user-context';
import api from '../services/api';

import './search.css';

export default function SearchResults({ location }) {
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');

  const searchTerm = location.state.search;

  const { themePref, lightStyle, darkStyle } = useContext(UserContext);

  const user = localStorage.getItem('user');

  const isLastPage = () => {
    if (Math.ceil(totalUsers / 3) === page) {
      return true;
    }
    return false;
  };

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting) {
      setPage((currPage) => currPage + 1);
    }
  };

  const getSearchResults = async () => {
    const response = await api.get(`/user/name/${searchTerm}?page=${page}`, {
      headers: { user },
    });
    setTotalUsers(response.data.totalUsers);
    if (!response.data.users) {
      setMessage(response.data.message);
    } else {
      setSearchResults((users) => [...users, ...response.data.users]);
    }
  };

  useEffect(() => {
    getSearchResults();
  }, []);

  return (
    <div
      className="search-results-container"
      style={themePref === 'dark' ? darkStyle : lightStyle}
    >
      {searchResults.length !== 0 ? (
        <ul>
          {searchResults.map((user) => (
            <li key={user._id}>
              <Link
                style={themePref === 'dark' ? darkStyle : lightStyle}
                to={`/u/${user._id}`}
              >
                <h3>{user.username}</h3>
                <p>{`${user.firstName} ${user.lastName}`}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>Could not find user</div>
      )}
    </div>
  );
}
