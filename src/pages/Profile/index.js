import React, { useContext, useEffect, useRef, useState } from 'react';

import api from '../../services/api';
import Post from '../../components/Post';
import { UserContext } from '../../user-context';

import './Profile.css';

export default function Profile({ history, match }) {
  const [profile, setProfile] = useState({});
  const [isFollowed, setIsFollowed] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  const user = localStorage.getItem('user');
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
    if (data.isFollowed) {
      setIsFollowed(true);
    } else {
      setIsFollowed(false);
    }
  };

  const timelineSetter = (data) => {
    setTimeline((posts) => [...posts, ...data.posts]);
  };

  const getUser = async () => {
    try {
      const response = await api.get(`/user/id/${location.slice(3)}`, {
        headers: { user },
      });
      profileSetter(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getProfile = async () => {
    try {
      const response = await api.get(`/user/id/${user_id}`, {
        headers: { user },
      });
      profileSetter(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserTimeline = async () => {
    const response = await api.get(`/posts?page=${page}`, {
      headers: { user_id: location.slice(3), user },
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
        headers: { user, user_id },
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

  const followUser = async (userId) => {
    try {
      const response = await api.post(
        '/user/follow',
        { userToFollow: userId },
        { headers: { user } }
      );
      if (response?.status === 201) {
        setIsFollowed(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async (userId) => {
    try {
      const response = await api.delete(`/unfollow/user/${userId}`, {
        headers: { user },
      });
      if (response?.status === 204) {
        setIsFollowed(false);
      }
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
      <div className="profile">
        <div className="profile-data">
          {Object.keys(profile).length !== 0 ? (
            <>
              <div className="username">
                <h3>{profile.username}</h3>
                {location.match(/\/u\//) &&
                !location.match(new RegExp(user_id)) ? (
                  isFollowed ? (
                    <button
                      className="cta--follow"
                      onClick={() => unfollowUser(profile._id)}
                    >
                      <p>Unfollow</p>
                    </button>
                  ) : (
                    <button
                      className="cta--follow"
                      onClick={() => followUser(profile._id)}
                    >
                      <p>Follow</p>
                    </button>
                  )
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
            timeline.map((post) => <Post key={post._id} post={post} />)
          ) : (
            <div className="message--error">{message}</div>
          )}
          {!isLastPage() ? <div className="loading" ref={loader}></div> : ''}
        </div>
      </div>
    </div>
  );
}
