import React, { useEffect, useState, useContext } from 'react';

import api from '../../services/api';
import Post from '../../components/Post';
import { UserContext } from '../../user-context';
import CreatePost from '../../components/CreatePost';

import './Home.css';

export default function Home({ history }) {
  const [feed, setFeed] = useState([]);
  const [message, setMessage] = useState('');

  const { themePref, lightStyle, darkStyle } = useContext(UserContext);

  const getFeed = async () => {
    try {
      const response = await api.get('/home');
      if (!response.data.feedPosts) {
        setMessage(response.data.message);
      } else {
        setFeed(response.data.feedPosts);
      }
    } catch (error) {
      if (error.response.status === 400) {
        setMessage('Cannot load feed');
      }
      history.push('/');
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div
      className="feed-container"
      style={themePref === 'dark' ? darkStyle : lightStyle}
    >
      <div className="feed">
        <CreatePost />
        {feed.length !== 0 ? (
          feed.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <div className="message--error">{message}</div>
        )}
      </div>
    </div>
  );
}
