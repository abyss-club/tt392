import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TitleRow = styled.div`
  display: flex;
  > * {
    display: block;
  }
  > select {
    width: 5rem;
  }
  > input {
    width: 100%;
    flex-shrink: 1;
  }
`;

const TagRow = styled.div`
  display: flex;
  > * {
    display: block;
  }
  > input {
    width: 100%;
    flex-shrink: 1;
  }
`;

class ThreadInfo extends React.Component {
  state = {
    title: '',
    mainTag: '',
    subTags: [],
  }

  setSubTag = idx => (
    (event) => {
      const { subTags } = this.state;
      subTags[idx] = event.target.value;
      this.setState({ subTags });
    }
  )

  setTitle = (event) => {
    this.setState({ title: event.target.value });
  }

  selectMainTag = (event) => { this.setState({ mainTag: event.target.value }); }

  render() {
    const { title, mainTag, mainTags, subTags } = this.props;
    return (
      <div>
        <TitleRow>
          <input type="text" value={title || ''} onChange={this.setTitle} placeholder="标题" />
          <select value={mainTag} onChange={this.selectMainTag}>
            <option>主标签</option>
            {mainTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
          ))}
          </select>
        </TitleRow>
        <TagRow>
          {[0, 1, 2, 3].map(idx => (
            <input
              key={idx}
              type="text"
              value={subTags[idx] || ''}
              onChange={this.setSubTag(idx)}
              placeholder={`子标签${idx}`}
            />
        ))}
        </TagRow>
      </div>
    );
  }
}
ThreadInfo.propTypes = {
  title: PropTypes.string.isRequired,
  mainTag: PropTypes.string.isRequired,
  mainTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  subTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  setThread: PropTypes.func.isRequired,
};

export default ThreadInfo;
