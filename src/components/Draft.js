import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Editor from 'components/Editor';
import MDPreview from 'components/MDPreview';
import colors from 'utils/colors';

// import { Mutation } from 'react-apollo'

const TitleRow = styled.div`
  display: flex;
  margin: .5rem 0;
  > * {
    display: block;
  }
  > select {
    width: 5rem;
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
  border-bottom: 1px solid black;
  :focus {
    border-bottom: 1px solid ${colors.orange};
  }
`;

class Draft extends React.Component {
  state = {
    text: '',
    preview: false,
    mainTags: ['MainA', 'MainB', 'MainC'],

    // for thread
    title: '',
    mainTag: '',
    subTags: [],
  };

  setSubTag = idx => (
    (event) => {
      const { subTags } = this.state;
      subTags[idx] = event.target.value;
      this.setState({ subTags });
    }
  )

  setTitle = (event) => { this.setState({ title: event.target.value }); }

  selectMainTag = (event) => { this.setState({ mainTag: event.target.value }); }

  saveText = (text) => { this.setState({ text }); }

  togglePreview = () => {
    const { preview } = this.state;
    this.setState({ preview: !preview });
  }

  render() {
    const { match } = this.props;
    const {
      preview, text, mainTags, title, mainTag, subTags,
    } = this.state;
    const threadSetting = (match.params.mode === 'thread') && (
      <div>
        <TitleRow>
          <Input type="text" value={title || ''} onChange={this.setTitle} placeholder="标题" />
          <select value={mainTag} onChange={this.selectMainTag}>
            <option>主标签</option>
            {mainTags.map(tag => (
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
    return (
      <div>
        { preview ? (
          <MDPreview text={text} />
        ) : (
          <Editor text={text} save={this.saveText} />
        )}
        { threadSetting }
        <button onClick={this.togglePreview}>{preview ? '编辑' : '预览' }</button>
        <button>匿名发送</button>
        <button>添加用户名</button>
      </div>
    );
  }
}
Draft.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      mode: PropTypes.string,
    }),
  }).isRequired,
};

export default Draft;
