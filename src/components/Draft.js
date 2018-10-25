import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import qs from 'qs';
import { Query, Mutation } from 'react-apollo';

import Editor from 'components/Editor';
import MDPreview from 'components/MDPreview';
import QuotedContent from 'components/QuotedContent';
import SubTagInput from 'components/SubTagInput';
import LinkIcon from 'components/icons/Link';
import Image from 'components/icons/Image';
import Tick from 'components/icons/Tick';
import Store from 'providers/Store';
import colors from 'utils/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { maxWidth } from 'styles/MainContent';

const TitleRow = styled.div`
  display: flex;
  margin: .5rem 0rem 0;
  padding-bottom: .25rem;
  border-bottom: 1px solid ${colors.inputGrey};
`;

const Input = styled.input`
  border: none;
  outline: none;
  min-width: 0;
  ::placeholder {
    color: ${colors.regularGrey};
  }
`;

const QuotedWrapper = styled.div`
  margin-top: .5em;
  width: 100%;
`;

const QuotedBtn = styled.button`
  background-color: ${colors.skyblue};
  color: white;
  border: none;
  cursor: pointer;
  outline: none;
  padding: .5em .5em;
  margin-right: .25em;
  border-radius: 5px;
  font-size: .8em;
`;

const QuotedContentWrapper = styled.div`
  margin: .5em 0;
`;

const PreviewArea = styled.div`
  background-color: white;
  padding: 1em;
`;

const DraftArea = styled.div`
  background-color: white;
  padding: 1rem 1rem 0 1rem;
  border-radius: 1rem;
  max-width: ${maxWidth}rem;
  margin: 0 auto;
`;

const DropdownWrapper = styled.div`
  display: inline-block;
  position: relative;
  font-size: .875em;
  margin-left: auto;
  /* the angle-down arrow */
  :after {
    z-index: 100;
    display: block;
    content: " ";
    position: absolute;
    width: .25rem;
    height: .25rem;
    margin-top: -.375em;
    right: .625em;
    top: 50%;
    border: 1px solid ${colors.regularBlack};
    border-right: 0;
    border-top: 0;
    pointer-events: none;
    transform: rotate(-45deg);
    transform-origin: center;
  }
`;

const Dropdown = styled.select`
  display: block;
  position: relative;
  appearance: none;
  border: none;
  padding: .2em .5em;
  width: 8em;
  max-width: 100%;
  height: 1.75em;
  background-color: white;
  color: black;
  font-size: 1em;
  cursor: pointer;
  :invalid {
    color: #8E8E8E;
  }
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

const TitleInput = styled(Input)`
  font-size: 1.25em;
  font-weight: 700;
`;

const IconWrapper = styled.button`
  display: inline-flex;
  align-items: center;

  appearance: none;
  border: 0;
  background: none;
  outline: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
`;

const ToolBtn = styled(IconWrapper)`
  font-size: 1.5em;
  padding: 0 .5rem;
`;

const AnonBtn = styled(IconWrapper)`
  font-size: .875em;
  color: ${props => (props.isAnon ? colors.anonBlack : colors.regularGrey)};
  svg {
    path {
      stroke: white;
    }
  }
`;

const PreviewBtn = styled(IconWrapper)`
  padding: 0 0 0 .5rem;
  color: ${colors.regularGrey};
  font-size: .875em;
  font-weight: 700;
`;

const AnonIcon = styled.div`
  margin-left: .5em;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  background-color: ${props => (props.isAnon ? colors.accentRed : 'unset')};
  ${props => (props.isAnon ? 'border: none;' : `border: 1px solid ${colors.regularGrey};`)}
  border-radius: 50%;
  font-size: .875em;
  line-height: 0;
  height: 1.5rem;
  width: 1.5rem;

  svg {
    padding-bottom: .1rem;
  }
`;

const QuotedContentArea = ({ threadID, quoted }) => (
  <Query query={QUERY_REFERS} variables={{ id: threadID }}>
    {({
      loading, error, data,
    }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error...</p>;
      const quotes = [];
      data.thread.replies.posts.forEach((post) => {
        Object.keys(quoted).forEach((quote) => {
          if (quoted[quote] && quote === post.id) quotes.push(post);
        });
      });
      return (
        <QuotedContent quotes={quotes} inDraft />
      );
    }}
  </Query>
);
QuotedContentArea.propTypes = {
  threadID: PropTypes.string.isRequired,
  quoted: PropTypes.shape().isRequired,
};

class Draft extends React.Component {
  constructor(props) {
    super(props);

    const {
      profile, history, location, setStore,
    } = props;
    if (!profile.isSignedIn) { // TODO: extract to component
      history.push('/sign_in/');
    }
    const params = qs.parse(location.search, { ignoreQueryPrefix: true });
    this.state = {
      text: '',
      preview: false,
      error: '',
      isAnon: false,

      // for thread
      title: '',
      mainTag: '',
      subTags: new Set(),

      // for post: reply
      replyTo: params.reply,

      // for quoted
      quoted: params.p ? params.p.reduce((acc, postID) => {
        acc[postID] = true;
        return acc;
      }, {}) : null,
    };
    setStore({ publish: this.publish });
  }

  setSubTag = ({ type, tagName }) => {
    this.setState((prevState) => {
      const prevSet = new Set(prevState.subTags);
      if (type === 'remove') prevSet.delete(tagName);
      else if (type === 'add') prevSet.add(tagName);
      return { subTags: prevSet };
    });
  }

  setTitle = (event) => {
    event.preventDefault();
    this.setState({ title: event.target.value });
  }

  checkPublishRdy = () => {
    let rdy = false;
    const { text, mainTag } = this.state;
    const { mode } = this.props.match.params;
    if (mode === 'thread') {
      rdy = !!text && !!mainTag;
    } else if (mode === 'post') {
      rdy = !!text;
    }
    this.props.setStore({ publishRdy: rdy });
  }

  selectMainTag = (event) => {
    event.preventDefault();
    this.setState({ mainTag: event.target.value });
    this.checkPublishRdy();
  }

  saveText = (text) => {
    this.setState({ text });
    this.checkPublishRdy();
  }

  togglePreview = () => {
    const { preview } = this.state;
    this.setState({ preview: !preview });
  }

  toggleQuoted = ({ id }) => {
    this.setState(prevState => ({
      quoted: {
        ...prevState.quoted,
        [id]: !prevState.quoted[id],
      },
    }));
  }

  toggleAnon = () => {
    this.setState(prevState => ({
      isAnon: !prevState.isAnon,
    }));
  }

  publish = () => {
    const { mode } = this.props.match.params;
    if (mode === 'thread') {
      this.pubThread();
    } else {
      this.pubPost();
    }
  }

  pubThread = () => {
    const { pubThread, history } = this.props;
    const {
      text, mainTag, subTags, title, isAnon: anonymous,
    } = this.state;

    if (mainTag === '') {
      this.setState({ error: '必须选择一个主标签' });
      return;
    }
    if (text === '') {
      this.setState({ error: '内容不能为空' });
      return;
    }

    const thread = {
      anonymous, content: text, mainTag, subTags: [...subTags], title,
    };

    this.setState({ error: '' });
    pubThread({ variables: { thread } }).then(({ data }) => {
      history.push(`/thread/${data.pubThread.id}/`);
    }).catch(() => {
      this.setState({ error: '网络错误 请重试' });
    });
  }

  pubPost = () => {
    const {
      replyTo, text, quoted, isAnon: anonymous,
    } = this.state;
    const { pubPost, history } = this.props;
    const quotes = quoted && Object.keys(quoted).reduce((acc, id) => {
      if (quoted[id]) acc.push(id);
      return acc;
    }, []);
    const post = {
      threadID: replyTo,
      anonymous,
      content: text,
      quotes,
    };
    if (text === '') {
      this.setState({ error: '内容不能为空' });
      return;
    }
    this.setState({ error: '' });
    pubPost({ variables: { post } }).then(() => {
      history.push(`/thread/${replyTo}/`, { reload: true });
    }).catch(() => {
      this.setState({ error: '网络错误 请重试' });
    });
  }

  render() {
    const { match, tags } = this.props;
    const { mode } = match.params;
    if (mode !== 'thread' && mode !== 'post') {
      return <p>404 not found</p>;
    }
    const {
      preview, error, text, title, mainTag, subTags, quoted, isAnon, replyTo,
    } = this.state;
    const threadSetting = (mode === 'thread') && (
      <div>
        <TitleRow>
          <TitleInput type="text" value={title || ''} onChange={this.setTitle} placeholder="标题（可选）" />
          <DropdownWrapper>
            <Dropdown value={mainTag} onChange={this.selectMainTag}>
              <option>添加主标签…</option>
              {[...tags.mainTags].map(tag => (
                <option key={tag} value={tag}>{tag}</option>
            ))}
            </Dropdown>
          </DropdownWrapper>
        </TitleRow>
        <SubTagInput setSubTag={this.setSubTag} subTags={subTags} />
      </div>
    );
    const quotedContent = (quoted) && (
      <QuotedWrapper>
        {Object.keys(quoted).map(id => (
          <QuotedBtn key={id} onClick={() => this.toggleQuoted({ id })}>
            {quoted[id] ? (<FontAwesomeIcon icon="check-square" />) : (<FontAwesomeIcon icon="square" />)}
            <span> {id}</span>
          </QuotedBtn>
        ))}
        <QuotedContentWrapper>
          <QuotedContentArea threadID={replyTo} quoted={quoted} />
        </QuotedContentWrapper>
      </QuotedWrapper>
    );
    // const publish = () => {
    //   if (mode === 'thread') {
    //     this.pubThread();
    //   } else {
    //     this.pubPost();
    //   }
    // };
    const anonSwitch = (
      <AnonBtn onClick={this.toggleAnon} isAnon={isAnon}>
        匿名发送<AnonIcon isAnon={isAnon}><Tick /></AnonIcon>
      </AnonBtn>
    );
    return (
      <DraftArea>
        { quotedContent }
        { threadSetting }
        { preview ? (
          <PreviewArea>
            <MDPreview text={text} />
          </PreviewArea>
        ) : (
          <Editor
            text={text}
            save={this.saveText}
            ref={(instance) => { this.editorChild = instance; }}
          />
        )}
        {(error !== '') && (<p>错误：{error}</p>)}
        <ButtonRow>
          {anonSwitch}
          <ButtonRowRight>
            <ToolBtn onClick={() => this.editorChild.handleLinkClick()}>
              <LinkIcon />
            </ToolBtn>
            <ToolBtn onClick={() => this.editorChild.handleImageClick()}>
              <Image />
            </ToolBtn>
            <PreviewBtn onClick={this.togglePreview}>{preview ? '编辑' : '预览' }</PreviewBtn>
          </ButtonRowRight>
        </ButtonRow>
      </DraftArea>
    );
  }
}
Draft.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      mode: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  setStore: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
  pubThread: PropTypes.func.isRequired,
  pubPost: PropTypes.func.isRequired,
  tags: PropTypes.shape().isRequired,
  profile: PropTypes.shape().isRequired,
};

const PUB_THREAD = gql`
  mutation PubThread($thread: ThreadInput!) {
    pubThread(thread: $thread) {
      id
    }
  }
`;

const PUB_POST = gql`
  mutation PubPost($post: PostInput!) {
    pubPost(post: $post) {
      id
    }
  }
`;

const QUERY_REFERS = gql`
  query Thread($id: String!) {
    thread(id: $id) {
      replies(query: { after: "", limit: 100}) {
        posts {
          id, author, content, createTime
        }
      }
    }
  }
`;

export default props => (
  <Store.Consumer>
    {({ profile, tags, setStore }) => (
      <Mutation mutation={PUB_THREAD}>
        {pubThread => (
          <Mutation mutation={PUB_POST}>
            {pubPost => (
              <Draft
                {...props}
                pubThread={pubThread}
                pubPost={pubPost}
                profile={profile}
                tags={tags}
                setStore={setStore}
              />
            )}
          </Mutation>
        )}
      </Mutation>
    )}
  </Store.Consumer>
);
