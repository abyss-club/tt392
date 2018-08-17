import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import qs from 'qs';
import { Mutation } from 'react-apollo';

import Editor from 'components/Editor';
import MDPreview from 'components/MDPreview';
import Store from 'providers/Store';
import MainContent from 'styles/MainContent';
import colors from 'utils/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import { Mutation } from 'react-apollo'

const TitleRow = styled.div`
  display: flex;
  margin: .5rem 0;
  > * {
    display: block;
  }
  > select {
    width: 6rem;
  }
  > input {
    width: 100%;
    flex-shrink: 1;
    margin-right: .5rem;
  }
`;

const TagRow = styled.div`
  display: flex;
  margin: .5rem -.25rem;
  > * {
    display: block;
  }
  > input {
    width: 100%;
    flex-shrink: 1;
    margin: 0 .25rem;
  }
`;

const Input = styled.input`
  border: none;
  outline: none;
  min-width: 0;
  border-bottom: 1px solid black;
  :focus {
    border-bottom: 1px solid ${colors.orange};
  }
`;

class Draft extends React.Component {
  constructor(props) {
    super(props);

    const { profile, history, location } = props;
    if (!profile.isSignedIn) { // TODO: extract to component
      history.push('/sign_in/');
    }
    const params = qs.parse(location.search, { ignoreQueryPrefix: true });
    this.state = {
      text: '',
      preview: false,
      error: '',

      // for thread
      title: '',
      mainTag: '',
      subTags: [],

      // for post: reply
      replyTo: params.reply,
    };
  }

  setSubTag = idx => (
    (event) => {
      event.preventDefault();
      const { subTags } = this.state;
      subTags[idx] = event.target.value;
      this.setState({ subTags });
    }
  )

  setTitle = (event) => {
    event.preventDefault();
    this.setState({ title: event.target.value });
  }

  selectMainTag = (event) => {
    event.preventDefault();
    this.setState({ mainTag: event.target.value });
  }

  saveText = (text) => { this.setState({ text }); }

  togglePreview = () => {
    const { preview } = this.state;
    this.setState({ preview: !preview });
  }

  pubThread = (anonymous) => {
    const { pubThread, history } = this.props;
    const {
      text, mainTag, subTags, title,
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
      anonymous, content: text, mainTag, subTags, title,
    };
    this.setState({ error: '' });
    pubThread({ variables: { thread } }).then(({ data }) => {
      history.push(`/thread/${data.pubThread.id}/`);
    }).catch(() => {
      this.setState({ error: '网络错误 请重试' });
    });
  }

  pubPost = (anonymous) => {
    const { replyTo, text } = this.state;
    const { pubPost, history } = this.props;
    const post = {
      threadID: replyTo,
      anonymous,
      content: text,
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
    const { match, profile, tags } = this.props;
    const { mode } = match.params;
    if (mode !== 'thread' && mode !== 'post') {
      return <p>404 not found</p>;
    }
    const {
      preview, error, text, title, mainTag, subTags,
    } = this.state;
    const threadSetting = (mode === 'thread') && (
      <div>
        <TitleRow>
          <Input type="text" value={title || ''} onChange={this.setTitle} placeholder="标题" />
          <select value={mainTag} onChange={this.selectMainTag}>
            <option>主标签</option>
            {[...tags.mainTags].map(tag => (
              <option key={tag} value={tag}>{tag}</option>
          ))}
          </select>
        </TitleRow>
        <TagRow>
          {[0, 1, 2, 3].map(idx => (
            <Input
              key={idx}
              type="text"
              value={subTags[idx] || ''}
              onChange={this.setSubTag(idx)}
              placeholder="子标签"
            />
        ))}
        </TagRow>
      </div>
    );
    const publish = anonymous => (() => {
      if (mode === 'thread') {
        this.pubThread(anonymous);
      } else {
        this.pubPost(anonymous);
      }
    });
    return (
      <MainContent>
        { preview ? (
          <MDPreview text={text} />
        ) : (
          <Editor text={text} save={this.saveText} />
        )}
        { threadSetting }
        {(error !== '') && (<p>错误：{error}</p>)}
        <button onClick={this.togglePreview}>{preview ? '编辑' : '预览' }</button>
        <button onClick={publish(true)}>匿名发送</button>
        <button onClick={publish(false)} disabled={profile.name === ''}>具名发送</button>
      </MainContent>
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

export default props => (
  <Store.Consumer>
    {({ profile, tags }) => (
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
              />
            )}
          </Mutation>
        )}
      </Mutation>
    )}
  </Store.Consumer>
);
