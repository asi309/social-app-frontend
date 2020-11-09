import React, { useEffect, useState, useContext } from 'react';

import api from '../../services/api';
import { UserContext } from '../../user-context';

import './Home.css';

export default function Home({ history }) {
  const [feed, setFeed] = useState([]);
  const [message, setMessage] = useState('');

  const { themePref, lightStyle, darkStyle } = useContext(UserContext);

  const getFeed = async () => {
    try {
      const response = await api.get('/home');
      if (response.data.length === 0) {
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
        {feed ? (
          feed.length !== 0 ? (
            feed.map((post) => (
              <article key={post._id} className="post">
                <header>
                  <div className="author--name">{post.author.username}</div>
                </header>
                <div className="content-container">{post.content}</div>
                <div className="actions--social">
                  <button className="like">Like</button>
                  <button className="comment">Comment</button>
                </div>
              </article>
            ))
          ) : (
            <div className="message--error">{message}</div>
          )
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
