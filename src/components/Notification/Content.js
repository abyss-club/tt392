import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import MDPreview from 'components/MDPreview';
import colors from 'utils/colors';
import elapsed from 'utils/calculateTime';
import fontFamilies from 'utils/fontFamilies';

import Tag from 'components/Tag';
import QuotedContent from 'components/QuotedContent';

const TagRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  margin-bottom: .175rem;
`;

const ContentWrapper = styled.article`
  background-color: white;
  border: none;
  padding: 1rem 0 0;
  :last-of-type {
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
    padding-bottom: 1rem;
  }
  :not(:last-of-type):after {
    content: "";
    display: block;
    width: calc(100% - 2rem);
    border-bottom: 1px solid ${colors.borderGrey};
    margin: 0 1rem;
  }
`;

const Title = styled.h5`
  width: 100%;
  font-family: ${fontFamilies.system};
  font-size: .875rem;
  font-weight: 600;
  padding: 0 1rem;
  margin-bottom: .25rem;
  > a {
    width: 100%;
    display: block;
    color: ${colors.titleBlack};
    text-decoration: none;
  }
`;

const ViewThread = styled.p`
  padding: .5rem 1rem;
  font-size: .75em;
  line-height: 1.5;
  color: ${colors.accentRed};
  > a {
    color: ${colors.accentRed};
    text-decoration: none;
  }
`;

const MetaRow = styled.p`
  width: 100%;
  display: flex;
  align-items: center;
  padding: .5rem 1rem;
`;

const PostWrapper = styled.article`
  background-color: ${colors.bgGrey};
`;

const AuthorWrapper = styled.span`
  color: ${colors.regularBlack};
  font-family: ${props => (props.anonymous ? '"PT Mono", monospace' : fontFamilies.system)};
  line-height: ${props => (props.anonymous ? '1.3' : 'unset')};
  font-size: .75em;
`;

const PostContent = styled.p`
  padding: .5rem 1rem;
  font-size: .875rem;
`;

const PublishTime = styled.span`
  font-family: ${fontFamilies.system};
  color: ${colors.regularGrey};
  font-size: .75em;
`;

const StyledMDPreview = styled.div`
  padding: .5rem 1rem;
`;

const titlePlaceholder = '无题';

const authorText = ({ anonymous, author }) => (anonymous ? (
  <AuthorWrapper anonymous>匿名{author}</AuthorWrapper>
) : (
  <AuthorWrapper>{author}</AuthorWrapper>
));
authorText.propTypes = {
  anonymous: PropTypes.bool.isRequired,
  author: PropTypes.string.isRequired,
};

const Content = ({ type, notification }) => {
  const tags = (type === 'replied' || type === 'quoted') && (
    <TagRow>
      <Tag text={notification.thread.mainTag} isMain isCompact />
      {(notification.thread.subTags || []).map(t => <Tag key={t} text={t} isCompact />)}
    </TagRow>
  );
  const repliedNoti = (type === 'replied') && (
    <ContentWrapper>
      {tags}
      <Title>{notification.thread.title || titlePlaceholder}</Title>
      <QuotedContent
        inNoti
        quotes={notification.thread.replies.posts.slice().reverse()}
      />
      {/* Duplicate the array, then reverse it. */}
      <ViewThread>
        <Link to={`/thread/${notification.thread.id}`}>
          {`查看全部 ${notification.thread.replyCount} 个帖`}
        </Link>
      </ViewThread>
    </ContentWrapper>
  );
  const quotedNoti = (type === 'quoted') && (
    <ContentWrapper>
      {tags}
      <Title>{notification.thread.title || titlePlaceholder}</Title>
      <PostWrapper>
        <MetaRow>
          {authorText({
            anonymous: notification.post.anonymous,
            author: notification.post.author,
          })}
          <PublishTime>&nbsp;·&nbsp;{elapsed(notification.post.createTime).formatted}</PublishTime>
        </MetaRow>
        <QuotedContent
          inNoti
          quotes={[notification.quotedPost]}
        />
        <PostContent>{notification.post.content}</PostContent>
      </PostWrapper>
    </ContentWrapper>
  );
  const systemNoti = (type === 'system') && (
    <ContentWrapper>
      <Title>{notification.title}</Title>
      <StyledMDPreview>
        <MDPreview text={notification.content} isThread />
      </StyledMDPreview>
    </ContentWrapper>
  );
  const contentByType = ((type === 'replied') && repliedNoti) || ((type === 'quoted') && quotedNoti) || systemNoti;
  return (
    <React.Fragment>
      {contentByType}
    </React.Fragment>
  );
};
Content.propTypes = {
  type: PropTypes.string.isRequired,
  notification: PropTypes.shape().isRequired,
};

export default Content;
