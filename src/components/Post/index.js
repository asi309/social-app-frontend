import React, { useEffect, useMemo, useState } from 'react';

import api from '../../services/api';

import './Post.css';

export default function Post(props) {
  const { post } = props;
  const [like, setLike] = useState(false);
  const [likes, setLikes] = useState(0);
  const [likeButtonStyle, setLikeButtonStyle] = useState({});
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(0);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');

  const likeHandler = async (post_id) => {
    try {
      const response = await api.get('/post/like', { headers: { post_id } });
      setLikes(response.data.existing_post.likes.length);
      setLike(!like);
    } catch (error) {
      setError(true);
      setMessage('Cannot perform operation');
      setTimeout(() => {
        setError(false);
        setMessage('');
      }, 2200);
    }
  };

  const commentHandler = async (post_id) => {
    try {
      const response = await api.post(
        '/post/comment',
        { content: comment },
        { headers: { post_id } }
      );
      setComments(response.data.existing_post.comments.length);
      setComment('');
    } catch (error) {}
  };

  useEffect(() => {
    setLikes(post.likes.length);
    setComments(post.comments.length);
    if (
      post.likes.find(
        (like) => like.user.toString() === localStorage.getItem('user_id')
      )
    ) {
      setLike(true);
    } else {
      setLike(false);
    }
  }, []);

  useMemo(() => {
    if (like) {
      setLikeButtonStyle({ color: '#0075ff' });
    } else {
      setLikeButtonStyle({ color: 'inherit' });
    }
  }, [like]);

  return (
    <article className="post">
      <header>
        <div className="author--name">{post.author.username}</div>
      </header>
      <div className="content-container">{post.content}</div>
      <div className="stats">
        <div className="stats--like">
          {likes}
          {likes !== 1 ? ' likes' : ' like'}
        </div>
        <div className="stats--comments">
          {comments > 0 ? comments : ''}
          {comments === 1
            ? ' comment'
            : comments === 0
            ? 'No comments'
            : ' comments'}
        </div>
      </div>
      <div className="actions--social">
        <section className="buttons">
          <button
            className="like"
            onClick={() => likeHandler(post._id)}
            style={likeButtonStyle}
          >
            <input
              type="checkbox"
              checked={like}
              readOnly
              style={{ display: 'none' }}
            />
            Like
          </button>
          <button className="comments">Comment</button>
        </section>
        <section className="comment">
          <div className="comment-container">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
            />
            <button
              disabled={comment.length === 0}
              onClick={() => commentHandler(post._id)}
            >
              Post
            </button>
          </div>
        </section>
      </div>
      {error ? <div className="message--reaction">{message}</div> : ''}
    </article>
  );
}
