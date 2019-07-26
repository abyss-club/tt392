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
  padding: 0 1rem;
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

const StyledLink = styled(Link)`
  color: ${colors.regularBlack};
  text-decoration: none;
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

const AuthorWrapper = styled.span`
  color: ${colors.regularBlack};
  font-family: ${props => (props.anonymous ? '"Roboto Mono", monospace' : fontFamilies.system)};
  line-height: ${props => (props.anonymous ? '1.3' : 'unset')};
  font-size: .875em;
  font-weight: 600;
  padding: 0 0 0 1rem;
`;

const PostContent = styled.p`
  padding: 0 1rem;
  font-size: .875rem;
  color: ${colors.textRegular};
`;

const PostTopRow = styled.div`
  display: flex;

  align-items: center;
  padding: 0 0 .5rem;
`;

const TimeRow = styled.div`
  font-family: ${fontFamilies.system};
  color: ${colors.regularGrey};
  font-size: .75em;
  white-space: nowrap;

  padding: ${(props => (props.isThreads ? '0 1rem 1rem' : '0'))};
`;

const PostContentWrapper = styled.div`
  padding: 0 0 1rem;
`;

const StyledMDPreview = styled.div`
  padding: .5rem 1rem;
`;

const titlePlaceholder = '无题';

const AuthorText = ({ anonymous, author }) => (anonymous ? (
  <AuthorWrapper anonymous>
    匿名
    {author}
  </AuthorWrapper>
) : (
  <AuthorWrapper>{author}</AuthorWrapper>
));
AuthorText.propTypes = {
  anonymous: PropTypes.bool.isRequired,
  author: PropTypes.string.isRequired,
};

// function formatUsername(users) {
//   return users.map((user) => {
//
//   })
// }

const Content = ({ type, entry }) => {
  const formattedCreatedAt = new Date(entry.createdAt);
  const tags = (type === 'threads') && (
    <TopRow>
      <TagRow>
        <Tag text={entry.mainTag} isMain isCompact />
        {(entry.subTags || []).map(t => <Tag key={t} text={t} isCompact />)}
      </TagRow>
    </TopRow>
  );
  const threads = (type === 'threads') && (
    <ContentWrapper>
      {tags}
      <StyledLink to={`/thread/${entry.id}`}>
        <Title>{entry.title || titlePlaceholder}</Title>
      </StyledLink>
      <PostContent>{entry.content}</PostContent>
      <TimeRow isThreads>{formattedCreatedAt.toLocaleString()}</TimeRow>
    </ContentWrapper>
  );
  const posts = (type === 'posts') && (
    <ContentWrapper>
      <PostTopRow>
        <AuthorText anonymous={entry.anonymous} author={entry.author} />
        <TimeRow>
          ·
          {formattedCreatedAt.toLocaleString()}
        </TimeRow>
      </PostTopRow>
      <PostContentWrapper>
        {entry.quotes.length > 0 && (
          <QuotedContent
            inUser
            quotes={entry.quotes}
          />
        )}
        <PostContent>{entry.content}</PostContent>
      </PostContentWrapper>
    </ContentWrapper>
  );
  const contentByType = ((type === 'posts') && posts) || ((type === 'threads') && threads);
  return (
    <>
      {contentByType}
    </>
  );
};
Content.propTypes = {
  type: PropTypes.string.isRequired,
  entry: PropTypes.shape().isRequired,
};

export default Content;
