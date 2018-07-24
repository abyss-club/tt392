import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SoftBreak from 'slate-soft-break';

import { Editor } from 'slate-react';
import { Value } from 'slate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import colors from 'utils/colors';
import MDPreview from './MDPreview';

const EditorViewWrapper = styled.div`
  width: 100%;

`;

const IconWrapper = styled.button`
  color: ${props => (props.topbar ? colors.zircon : colors.vulcan)};
  font-size: 1em;
  appearance: none;
  border: 0;
  background: none;
`;

const Topbar = styled.nav`
  width: 100%;
  background-color: ${colors.orange};
  color: ${colors.zircon};
  padding: .5em .5em;
  font-family: 'Lato', sans-serif;

  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
`;

const EditorArea = styled.div`
  width: 100%;
`;

const Toolbar = styled.div`
  width: 100%;
  
  display: flex;
  flex-flow: row nowrap;
`;

const SlateArea = styled.div`
  border: 1px solid ${colors.aluminium};
  border-radius: 2px;
  margin-top: .5em;
  padding: .5em;
  width: calc(100% - 2em);
  
  font-family: 'Helvetica Neue', Arial, sans-serif;
`;

const plugins = [
  SoftBreak(),
];

const Icon = ({ name, onClick }) => (
  <IconWrapper topbar onClick={onClick}>
    <FontAwesomeIcon icon={name} />
  </IconWrapper>
);
Icon.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
Icon.defaultProps = {
  onClick: () => {},
};

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
                text: '# A line of text in a paragraph.',
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
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
  }

  state = {
    value: initialValue,
    texts: [],
  }

  // On change, update the app's React state with the new editor value.
  onChange = ({ value }) => {
    this.setState({ value });
    this.extractText({ value });
  }

  handleLinkClick = () => {
    const type = 'link';
    const change = this.state.value.change().call(insertMarkup, type);

    this.onChange(change);
  }

  handleImageClick = () => {
    const type = 'image';
    const change = this.state.value.change().call(insertMarkup, type);

    this.onChange(change);
  }

  extractText({ value }) {
    const texts = [];
    value.document.nodes.forEach(val => texts.push(val.text));
    this.setState({ texts });
  }

  // Render the editor.
  render() {
    return (
      <EditorViewWrapper>
        <Topbar>
          <Icon name="times" />
          <span>Posting to...</span>
        </Topbar>
        <EditorArea>
          <Toolbar>
            <Icon name="link" onClick={this.handleLinkClick} />
            <Icon name="image" onClick={this.handleImageClick} />
          </Toolbar>
          <SlateArea>
            <Editor
              value={this.state.value}
              onChange={this.onChange}
              placeholder="Enter some text..."
              plugins={plugins}
            />
          </SlateArea>
          <MDPreview
            texts={this.state.texts}
          />
        </EditorArea>
      </EditorViewWrapper>
    );
  }
}

export default TextEditor;
