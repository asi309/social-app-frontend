import React, { useContext, useEffect, useState } from 'react';

import api from '../../services/api';
import Post from '../../components/Post';
import { UserContext } from '../../user-context';

import './PostDetails.css';

export default function PostDetails({ history, match }) {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');

  const { themePref, lightStyle, darkStyle } = useContext(UserContext);

  const user = localStorage.getItem('user');
  const user_id = localStorage.getItem('user_id');

  const postDetailsHandler = async () => {
    const post_id = match.url.slice(3);
    try {
      const response = await api.get(`/post/${post_id}`, { headers: { user } });
      if (!response.data) {
        setMessage('Cannot load post. Must have been removed by user');
      } else {
        setPost(response.data);
        setComments(response.data.comments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    postDetailsHandler();
  }, []);

  return (
    <div
      className="postDetails-container"
      style={themePref === 'dark' ? darkStyle : lightStyle}
    >
      <div className="postDetails">
        {Object.keys(post).length !== 0 ? (
          <>
            <Post key={post._id} post={post} details={true} />
            {console.log(comments)}
          </>
        ) : (
          <div className="message--error">{message}</div>
        )}
      </div>
    </div>
  );
}
