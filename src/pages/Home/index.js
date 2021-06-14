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
  const [newPostCreated, setNewPostCreated] = useState(false);

  const user = localStorage.getItem('user');
  const user_id = localStorage.getItem('user_id');

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
    if (user && user_id) {
      try {
        const response = await api.get(`/home?page=${page}`, {
          headers: { user },
        });
        setTotalPosts(response.data.totalPosts);
        if (!response.data.feedPosts) {
          setMessage(response.data.message);
        } else {
          setFeed((feed) => [...feed, ...response.data.feedPosts]);
        }
      } catch (error) {
        history.push('/');
      }
    } else {
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

  useEffect(() => {
    if (newPostCreated) {
      setPage(() => 1);
      setFeed(() => []);
      setNewPostCreated(() => false);
    }
  }, [newPostCreated]);

  return (
    <div
      className="feed-container"
      style={themePref === 'dark' ? darkStyle : lightStyle}
    >
      <div className="feed">
        <CreatePost newPost={setNewPostCreated} />
        {feed.length !== 0 ? (
          feed.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <div className="message--error">{message}</div>
        )}
        {!isLastPage() ? <div className="loading" ref={loader}></div> : ''}
      </div>
    </div>
  );
}
