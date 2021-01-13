import React, { useEffect, useState, useContext, useRef } from 'react';

import api from '../../services/api';
import Post from '../../components/Post';
import { UserContext } from '../../user-context';
import CreatePost from '../../components/CreatePost';

import './Home.css';

export default function Home({ history }) {
  const [feed, setFeed] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState('');

  const loader = useRef(null);

  const options = {
    root: null,
    rootMargin: '5px',
    threshold: 1.0,
  };

  const isLastPage = () => {
    if (Math.ceil(totalPosts / 3) === page) {
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

  const { themePref, lightStyle, darkStyle } = useContext(UserContext);

  const getFeed = async () => {
    try {
      const response = await api.get(`/home?page=${page}`);
      setTotalPosts(response.data.totalPosts);
      if (!response.data.feedPosts) {
        setMessage(response.data.message);
      } else {
        setFeed((feed) => [...feed, ...response.data.feedPosts]);
      }
    } catch (error) {
      setMessage('Cannot load feed. Please try again later');
      history.push('/');
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }
  }, []);

  useEffect(() => {
    getFeed();
  }, [page]);

  return (
    <div
      className="feed-container"
      style={themePref === 'dark' ? darkStyle : lightStyle}
    >
      <div className="feed">
        <CreatePost />
        {feed.length !== 0 ? (
          feed.map((post) => (
            <Post key={post._id} post={post} ownPost={false} />
          ))
        ) : (
          <div className="message--error">{message}</div>
        )}
        {!isLastPage() ? <div className="loading" ref={loader}></div> : ''}
      </div>
    </div>
  );
}
