import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MDPreview from 'components/MDPreview';
import colors from 'utils/colors';
import fontFamilies from 'utils/fontFamilies';
import timeElapsed from 'utils/calculateTime';

const Wrapper = styled.div`
  padding: .5rem 0;
  border-bottom: .5px solid #A7A7A7;
`;

const TitleRow = styled.div`
  width: 100%;
  display: flex;
  align-items: end;
  margin: .5rem 0;
`;

const Title = styled.h3`
  font-family: ${fontFamilies.system};
  margin: 0 0.5rem 0 0;
`;

const PublicTime = styled.span`
  margin-left: auto;
  font-family: 'Merriweather Sans', sans-serif;
`;

const PostContent = styled.div`
  width: 100%;
  font-family: ${fontFamilies.system};
`;

const AuthorWrapper = styled.span`
  color: ${props => (props.anonymous ? colors.vulcan : colors.orangeLight)};
  font-family: ${props => (props.anonymous ? '"PT Mono", monospace' : fontFamilies.system)};
`;

const titlePlaceholder = '无题';
const Post = ({
  isThread, title, anonymous, author, createTime, content,
}) => {
  const titleText = isThread ? (<Title>{title || titlePlaceholder}</Title>) : null;
  const authorText = anonymous ? (
    <AuthorWrapper anonymous>匿名{author}</AuthorWrapper>
  ) : (
    <AuthorWrapper>{author}</AuthorWrapper>
  );
  return (
    <Wrapper>
      <TitleRow>
        {titleText}
        {authorText}
        <PublicTime>{timeElapsed(createTime).formatted}</PublicTime>
      </TitleRow>
      <PostContent>
        <MDPreview text={content} />
      </PostContent>
    </Wrapper>
  );
};

Post.propTypes = {
  isThread: PropTypes.bool,
  title: PropTypes.string,
  anonymous: PropTypes.bool.isRequired,
  author: PropTypes.string.isRequired,
  createTime: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};
Post.defaultProps = {
  isThread: false,
  title: '',
};

export default Post;
