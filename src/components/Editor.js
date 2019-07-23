import React, {
  forwardRef, useState, useImperativeHandle, createRef, useContext,
} from 'react';
import isURL from 'validator/lib/isURL';
import styled from 'styled-components';

import DraftContext from 'providers/Draft';

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

const ContentArea = styled.textarea`
  background-color: white;
  border: none;
  width: 100%;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  resize: none;
`;

const TextEditor = forwardRef((_, ref) => {
  // Set the initial value when the app is first constructed
  const baseRow = 2;
  const [row, setRow] = useState(baseRow);
  const textareaRef = createRef();

  const [{ content }, dispatch] = useContext(DraftContext);

  // On change, update the app's React state with the new editor value.
  const onChange = (e) => {
    // setTimeout(setRow(baseRow), 0);
    resize();
    dispatch({ type: 'SET_CONTENT', content: e.target.value });
  };

  const resize = () => {
    const { scrollHeight, clientHeight } = textareaRef.current;
    setRow(row + (scrollHeight - clientHeight) / 16);
  };

  // Get selection range of the textarea
  const getSelection = () => {
    const textVal = textareaRef.current;
    const { selectionStart, selectionEnd } = textVal;
    return { selectionStart, selectionEnd };
  };

  useImperativeHandle(ref, () => ({
    handleBtnClick({ type }) {
      const insertText = ({ description, url }) => (type === 'link' ? `[${description || '标题'}](${url || ''})` : `![${description || '描述'}](${url || ''})`);

      const { selectionStart, selectionEnd } = getSelection();
      let newVal = content;
      const newRange = { start: 0, end: 0 };

      // when nothing is selected
      if (selectionStart === selectionEnd) {
        if (selectionStart === content.length) {
          newVal = `${content} ${insertText({})}`;
        } else {
          newVal = `${content.substring(0, selectionStart)} ${insertText({})} ${content.substring(selectionStart, content.length)}`;
        }
        // trying to manipulate cursor selection
        newRange.start = selectionStart - 2;
        newRange.end = selectionStart - 2;
      } else {
        // when something is selected
        const selectedText = content.slice(selectionStart, selectionEnd);
        // if selection is a URL, insert '[Title](${selection})'
        if (isURL(selectedText, { require_protocol: true })) {
          newVal = `${content.substring(0, selectionStart)} ${insertText({ url: selectedText })} ${content.substring(selectionEnd, content.length)}`;
          // try to manipulate cursor selection
          newRange.start = selectionStart - type === 'link' ? 7 : 13;
          newRange.end = selectionStart - 2;
        } else {
          // if selection isn't a URL, insert '[${selection}]()'
          newVal = `${content.substring(0, selectionStart)} ${insertText({ description: selectedText })} ${content.substring(selectionEnd, content.length)}`;
          // try to manipulate cursor selection
          newRange.start = selectionEnd + type === 'link' ? 2 : 3;
          newRange.end = selectionStart + type === 'link' ? 2 : 3;
        }
      }

      dispatch({ type: 'SET_CONTENT', content: newVal });

      // currently broken for unknown reason
      // textareaRef.current.setSelectionRange(newRange.start, newRange.end);

      textareaRef.current.focus();
    },
  }));

  return (
    <Wrapper>
      <ContentArea
        ref={textareaRef}
        value={content}
        onChange={onChange}
        placeholder="说点什么…"
        rows={row}
        required
        spellcheck
      />
    </Wrapper>
  );
});

export default TextEditor;
