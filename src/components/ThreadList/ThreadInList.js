import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CommonTags from 'components/Common/Tags';
import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';
import timeElapsed from 'utils/calculateTime';

const ThreadWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;

  border-bottom: .5px solid #A7A7A7;
`;

const ThreadTitle = styled.h2`
  font-family: ${fontFamilies.system};
`;

const ThreadTime = styled.span`
  margin-left: auto;
  font-family: 'Merriweather Sans', sans-serif;
`;

const ThreadFirstRow = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
`;

const ThreadContent = styled.div`
  width: 100%;
  padding-bottom: 1em;

  font-family: ${fontFamilies.system};
`;

const ThreadMeta = styled.div`
  display: flex;
  padding-bottom: 1em;
`;

const AuthorWrapper = styled.span`
  color: ${props => (props.anonymous ? colors.vulcan : colors.orangeLight)};
  font-family: ${props => (props.anonymous ? '"PT Mono", monospace' : fontFamilies.system)};
`;

const ThreadAuthor = ({ anonymous, author }) => (
  <React.Fragment>
    {(anonymous) ? (
      <AuthorWrapper anonymous>{author}</AuthorWrapper>) : (<AuthorWrapper>{author}</AuthorWrapper>
      )}
  </React.Fragment>
);

const ThreadInList = ({ thread }) => (
  <ThreadWrapper>
    <ThreadFirstRow>
      <ThreadTitle>{thread.title}</ThreadTitle>
      <CommonTags text={thread.mainTag} />
      <ThreadTime>{timeElapsed(thread.createTime).formatted}</ThreadTime>
    </ThreadFirstRow>
    <ThreadContent>{thread.content}</ThreadContent>
    <ThreadMeta>
      <ThreadAuthor anonymous={thread.anonymous} author={thread.author} />
    </ThreadMeta>
  </ThreadWrapper>
);

ThreadInList.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    anonymous: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createTime: PropTypes.string.isRequired,
    mainTag: PropTypes.string.isRequired,
  }).isRequired,
};

ThreadAuthor.propTypes = {
  anonymous: PropTypes.bool.isRequired,
  author: PropTypes.string.isRequired,
};

export default ThreadInList;
