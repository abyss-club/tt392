import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import RequireSignIn from 'components/RequireSignIn';
import Editor from 'components/Editor';
import MDPreview from 'components/MDPreview';
import LinkIcon from 'components/icons/Link';
import Image from 'components/icons/Image';
import colors from 'utils/colors';
import { maxWidth } from 'styles/MainContent';
import ThreadSettings from './ThreadSettings';
import PostSettings from './PostSettings';

const PreviewArea = styled.div`
  background-color: white;
  padding: 1em;
`;

const DraftArea = styled.div`
  background-color: white;
  padding: 1rem 1rem 0 1rem;
  max-width: ${maxWidth}rem;
  margin: 0 auto;
`;

const ButtonRow = styled.div`
  height: 3.5rem;
  display: flex;
  align-items: center;
`;

const ButtonRowRight = styled.div`
  margin-left: auto;

  display: inline-flex;
  align-items: center;
`;

const IconWrapper = styled.button`
  display: inline-flex;
  align-items: center;

  appearance: none;
  border: 0;
  background: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
`;

const ToolBtn = styled(IconWrapper)`
  font-size: 1.5em;
  padding: 0 .5rem;
`;

const PreviewBtn = styled(IconWrapper)`
  padding: 0 0 0 .5rem;
  color: ${colors.accentGreen};
  font-size: .875em;
`;

const Draft = ({ match }) => {
  const [preview, setPreview] = useState(false);
  const editorRef = useRef();

  const { mode } = match.params;
  const togglePreview = () => {
    setPreview(prevState => !prevState);
  };

  const editorAndPreview = (
    preview ? (
      <PreviewArea>
        <MDPreview inDraft />
      </PreviewArea>
    ) : (
      <Editor
        ref={editorRef}
      />
    )
  );

  const PostComposer = () => (
    <>
      <PostSettings />
      {editorAndPreview}
    </>
  );

  const ThreadComposer = () => (
    <>
      <ThreadSettings />
      {editorAndPreview}
    </>
  );

  return (
    <DraftArea>
      {mode === 'thread' ? (
        <ThreadComposer />
      ) : (
        <PostComposer />
      )}
      <ButtonRow>
        <ButtonRowRight>
          <ToolBtn onClick={() => editorRef.current.handleBtnClick({ type: 'link' })}>
            <LinkIcon />
          </ToolBtn>
          <ToolBtn onClick={() => editorRef.current.handleBtnClick({ type: 'image' })}>
            <Image />
          </ToolBtn>
          <PreviewBtn onClick={togglePreview}>{preview ? '编辑' : '预览' }</PreviewBtn>
        </ButtonRowRight>
      </ButtonRow>
    </DraftArea>
  );
};

Draft.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      mode: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default props => (
  <>
    <RequireSignIn />
    <Draft {...props} />
  </>
);
