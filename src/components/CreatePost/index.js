import React, { useMemo, useState } from 'react';
import { ContentState, convertToRaw, Editor, EditorState } from 'draft-js';

import api from '../../services/api';

import 'draft-js/dist/Draft.css';
import './CreatePost.css';

export default function CreatePost({newPost}) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');

  const postContent = useMemo(() => {
    const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
    const content = blocks
      .map((block) => (!block.text.trim() && '\n') || block.text)
      .join('\n');
    return content;
  }, [editorState]);

  const submitPostHandler = async () => {
    try {
      const response = await api.post('/create', { content: postContent });
      setEditorState(EditorState.push(editorState, ContentState.createFromText('')));
      if (response.status === 201) {
        setSuccess(true);
        newPost(() => true);
        setMessage(response.data.message);
        setTimeout(() => {
          setSuccess(false);
          setMessage('');
        }, 2200);
      }
    } catch (error) {
      console.log(error);
      setError(true);
      setMessage(error.response.data.message);
      setTimeout(() => {
        setError(false);
        setMessage('');
      }, 2200);
    }
  };

  return (
    <div className="post-creator">
      <div className="editor">
        <Editor editorState={editorState} onChange={setEditorState} />
        <button
          onClick={submitPostHandler}
          disabled={!editorState.getCurrentContent().hasText()}
        >
          Post
        </button>
      </div>
      {error ? <div className="message--error">{message}</div> : ''}
      {success ? <div className="message--success">{message}</div> : ''}
    </div>
  );
}
