import React, { useContext, useEffect, useRef, useState } from 'react';

import api from '../../services/api';
import Post from '../../components/Post';
import { UserContext } from '../../user-context';

import './Profile.css';

export default function Profile(props) {
  const [profile, setProfile] = useState({});
  const [timeline, setTimeline] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  const { history, match } = props;
  const user_id = localStorage.getItem('user_id');

  const loader = useRef(null);

  const options = {
    root: null,
    rootMargin: '10px',
    threshold: 1.0,
  };

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting) {
      setPage((curPage) => curPage + 1);
    }
  };

  const isLastPage = () => {
    return Math.ceil(totalPosts / 3) === page;
  };

  const { themePref, lightStyle, darkStyle } = useContext(UserContext);

  const profileSetter = (data) => {
    setProfile(() => data);
  };

  const timelineSetter = (data) => {
    setTimeline((posts) => [...posts, ...data.posts]);
  };

  const getUser = async () => {
    try {
      const response = await api.get(`/user/${location.slice(3)}`);
      profileSetter(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getProfile = async () => {
    try {
      const response = await api.get(`/user/${user_id}`);
      profileSetter(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserTimeline = async () => {
    const response = await api.get(`/posts?page=${page}`, {
      headers: { user_id: location.slice(3) },
    });
    setTotalPosts(response.data.totalPosts);
    if (!response.data.posts) {
      setMessage(response.data.message);
    } else {
      timelineSetter(response.data);
    }
  };

  const getTimeline = async () => {
    try {
      const response = await api.get(`/posts?page=${page}`, {
        headers: { user_id },
      });
      setTotalPosts(response.data.totalPosts);
      if (!response.data.posts) {
        setMessage(response.data.message);
      } else {
        timelineSetter(response.data);
      }
    } catch (error) {
      setMessage('Cannot load feed. Please try again later');
      history.push('/');
    }
  };

  const followUser = (userId) => {
    try {
      const response = api.post('/user/follow', { userToFollow: userId });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }
  }, []);

  useEffect(() => {
    setLocation(() => match.url);
  }, [match]);

  useEffect(() => {
    if (location.match(/\/u\//)) {
      getUser();
    } else if (location.match(/\profile/)) {
      getProfile();
    }
  }, [location]);

  useEffect(() => {
    if (location.match(/\/u\//)) {
      getUserTimeline();
    } else if (location.match(/\/profile/)) {
      getTimeline();
    }
  }, [page, location]);

  useEffect(() => {
    setPage(() => 1);
    setTimeline(() => []);
  }, [location]);

  return (
    <div
      className="profile-container"
      style={themePref === 'dark' ? darkStyle : lightStyle}
    >
      <div className="profile-data">
        {Object.keys(profile).length !== 0 ? (
          <>
            <div className="username">
              <h3>{profile.username}</h3>
              {location.match(/\/u\//) ? (
                <button
                  className="cta--follow"
                  onClick={() => followUser(profile._id)}
                  disabled={profile.isFollowed}
                >
                  {profile.isFollowed ? <p>Followed</p> : <p>Follow</p>}
                </button>
              ) : (
                ''
              )}
            </div>
            <div className="profile-stats">
              <div>
                <b>{profile.totalDocs}</b> posts
              </div>
              <div>
                <b>{profile.totalFollower}</b> followers
              </div>
              <div>
                <b>{profile.totalFollowing}</b> following
              </div>
            </div>
          </>
        ) : (
          ''
        )}
      </div>
      <div className="timeline">
        {timeline.length !== 0 ? (
          timeline.map((post) => (
            <Post key={post._id} post={post} ownPost={true} />
          ))
        ) : (
          <div className="message--error">{message}</div>
        )}
        {!isLastPage() ? <div className="loading" ref={loader}></div> : ''}
      </div>
    </div>
  );
}
