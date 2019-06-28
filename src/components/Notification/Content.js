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
  padding: 0 1rem;

  overflow: scroll hidden;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

const ContentWrapper = styled.article`
  background-color: white;
  border: none;
  padding: 1rem 0 0;
  :first-of-type {
    border-top-left-radius: .5rem;
    border-top-right-radius: .5rem;
    padding-bottom: 1rem;
  }
  :last-of-type {
    border-bottom-left-radius: .5rem;
    border-bottom-right-radius: .5rem;
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
  padding: 0 1rem .5rem;
  > a {
    width: 100%;
    display: block;
    color: ${colors.titleBlack};
    text-decoration: none;
  }

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const AnnouncementTitle = styled(Title)`
  overflow: visible;
  white-space: normal;
  hyphens: auto;
  overflow-wrap: break-word;

`;

const ViewThread = styled.p`
  padding: .5rem 1rem;
  font-size: .75em;
  line-height: 1.5;
  color: ${colors.accentGreen};
  > a {
    color: ${colors.accentGreen};
    text-decoration: none;
  }
`;

// const MetaRow = styled.p`
//   width: 100%;
//   display: flex;
//   align-items: center;
//   padding: .5rem 1rem;
// `;

const TopRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
`;

const PostWrapper = styled.article`
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

const PublishTime = styled.div`
  font-family: ${fontFamilies.system};
  color: ${colors.regularGrey};
  font-size: .75em;
  white-space: nowrap;
`;

const TopRowTime = styled(PublishTime)`
  padding: 0 1rem 0 .5rem;
  line-height: calc(1.15*4/3);
  {/* Wierd line-height hack */}
`;

const Repliers = styled.p`
  padding: .25rem 0 .25rem 1rem;
  font-size: .75rem;
  color: ${colors.textGrey};
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

// function formatUsername(users) {
//   return users.map((user) => {
//
//   })
// }

const Content = ({ type, notification }) => {
  const tags = (type === 'replied' || type === 'quoted') && (
    <TopRow>
      <TagRow>
        <Tag text={notification.thread.mainTag} isMain isCompact />
        {(notification.thread.subTags || []).map(t => <Tag key={t} text={t} isCompact />)}
      </TagRow>
      <TopRowTime>{elapsed(notification.eventTime).formatted}</TopRowTime>
    </TopRow>
  );
  const repliers = (type === 'replied') && (
    <div>
      <Repliers>
        {notification.thread.replies.posts.map(post => (post.anonymous ? `匿名${post.author}` : post.author)).filter((name, idx, names) => names.indexOf(name) === idx).join(', ')}
        {notification.repliers.length < 4 ? ' 回复了你的串' : ` 等 ${notification.repliers.length} 个用户回复了你的串`}
      </Repliers>
    </div>
  );
  const repliedNoti = (type === 'replied') && (
    <ContentWrapper>
      {tags}
      {repliers}
      <Title>{notification.thread.title || titlePlaceholder}</Title>
      <QuotedContent
        inNotiReply
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
      <Repliers>
        {notification.quotedPost.anonymous ? `匿名${notification.quoter}` : notification.quoter}
        {' 引用了你的帖'}
      </Repliers>
      <Title>{notification.thread.title || titlePlaceholder}</Title>
      <PostWrapper>
        <QuotedContent
          inNotiQuote
          quotes={[notification.quotedPost]}
        />
        <PostContent>{notification.post.content}</PostContent>
      </PostWrapper>
      <ViewThread>
        <Link to={`/thread/${notification.thread.id}`}>
          {'查看原帖'}
        </Link>
      </ViewThread>
    </ContentWrapper>
  );
  const systemNoti = (type === 'system') && (
    <ContentWrapper>
      <TopRow>
        <AnnouncementTitle>{notification.title}</AnnouncementTitle>
        <TopRowTime>{elapsed(notification.eventTime).formatted}</TopRowTime>
      </TopRow>
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
