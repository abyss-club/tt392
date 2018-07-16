import React from 'react';
import styled from 'styled-components';
import Prism from 'prismjs';

import { Editor } from 'slate-react';
import { Value } from 'slate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IconWrapper = styled.button`
font-size: 1em;
padding: 1em;
`;

const Toolbar = styled.div`
display: flex;
flex-flow: row nowrap;
`;

const LinkIcon = props => (
  <IconWrapper onClick={props.onClick}>
    <FontAwesomeIcon icon="link" />
  </IconWrapper>
);

const ImageIcon = props => (
  <IconWrapper onClick={props.onClick}>
    <FontAwesomeIcon icon="image" />
  </IconWrapper>
);

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'A line of text in a paragraph.',
              },
            ],
          },
        ],
      },
    ],
  },
});

function insertMarkup(change, type) {
  if (type === 'image') change.insertText('![Description]()');

  if (type === 'link') change.insertText('[Title]()');
  
  change.select();
}

// Define our app...
class TextEditor extends React.Component {
  // Set the initial value when the app is first constructed
  constructor(props) {
    super(props);
    this.onClickLink = this.onClickLink.bind(this);
  }

  state = {
    value: initialValue,
  }

  // On change, update the app's React state with the new editor value.
  onChange = ({ value }) => {
    this.setState({ value });
  }

  onClickLink = () => {
    const type = 'link';
    const change = this.state.value.change().call(insertMarkup, type);

    this.onChange(change);
  }

  onClickImage = () => {
    const type = 'image';
    const change = this.state.value.change().call(insertMarkup, type);

    this.onChange(change);
  }


  // Render the editor.
  render() {
    return (
      <div>
        <Toolbar>
          <LinkIcon onClick={this.onClickLink} />
          <ImageIcon onClick={this.onClickImage} />
        </Toolbar>
        <Editor
          value={this.state.value}
          onChange={this.onChange}
          placeholder="Enter some text..."
        />
      </div>
    );
  }
}

export default TextEditor;
