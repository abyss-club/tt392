import React, {
  forwardRef, useState, useImperativeHandle, useRef,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SoftBreak from 'slate-soft-break';

import { Editor } from 'slate-react';
import { Value } from 'slate';

// import LinkIcon from 'components/icons/Link';
// import Image from 'components/icons/Image';
// import colors from 'utils/colors';

const Wrapper = styled.div`
  min-height: 6em;
  font-size: .875em;
  width: 100%;
  @media screen and (-webkit-min-device-pixel-ratio:0) {
    *[contenteditable="true"] {
      font-size: 16px;
    }
  }
`;

// const IconWrapper = styled.button`
//   color: white;
//   font-size: 1em;
//   appearance: none;
//   border: 0;
//   background: none;
//   svg {
//     color: white;
//   }
// `;
//
// const Toolbar = styled.div`
//   width: 100%;
//   display: flex;
//   flex-flow: row nowrap;
//   color: black;
// `;

const SlateArea = styled.div`
  background-color: white;
  width: 100%;
  font-family: 'Helvetica Neue', Arial, sans-serif;
`;

const plugins = [
  SoftBreak(),
];

const initialValue = text => Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            text,
          },
        ],
      },
    ],
  },
});

// Define our app...
const TextEditor = forwardRef(({ text, save }, ref) => {
  // Set the initial value when the app is first constructed
  const [value, setValue] = useState(initialValue(text));
  const editorRef = useRef();

  // On change, update the app's React state with the new editor value.
  const onChange = (change) => {
    setValue(change.value);
    const texts = value.document.nodes.map(val => val.text);
    save(texts.join('\n'));
  };

  useImperativeHandle(ref, () => ({
    handleLinkClick() {
      const change = editorRef.current.command('insertText', ' [Title]() ').command('focus');
      onChange(change);
    },

    handleImageClick() {
      const change = editorRef.current.command('insertText', ' ![Description]() ').command('focus');
      onChange(change);
    },
  }));

  // Render the editor.
  return (
    <Wrapper>
      <SlateArea>
        <Editor
          ref={editorRef}
          value={value}
          onChange={onChange}
          placeholder="说点什么…"
          plugins={plugins}
        />
      </SlateArea>
    </Wrapper>
  );
});

TextEditor.propTypes = {
  text: PropTypes.string.isRequired,
  save: PropTypes.func.isRequired,
};

export default TextEditor;
