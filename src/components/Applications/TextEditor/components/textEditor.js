import React from 'react';
import Quill from 'quill';

class TextEditor extends React.Component {
  componentDidMount() {
    // eslint-disable-next-line
    const quill = new Quill('.quill', {
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block'],
        ],
      },
      placeholder: 'Compose an epic...',
      theme: 'snow',
    });
  }
  render() {
    return (
      <div className="text-editor">
        <div className="quill" />
      </div>
    );
  }
}

export default TextEditor;
