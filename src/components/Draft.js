import React from 'react';
import styled from 'styled-components';

import Editor from 'components/Editor';
import MDPreview from 'components/MDPreview';

import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';


class Draft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      preview: false,
    };
    this.saveText = this.saveText.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
  }

  saveText(text) {
    this.setState({ text });
  }

  togglePreview() {
    const { preview } = this.state;
    this.setState({ preview: !preview });
  }

  render() {
    const { preview, text } = this.state;
    return (
      <div>
        { preview ? (
          <MDPreview text={text} />
        ) : (
          <Editor text={text} save={this.saveText} />
        )}
        <button onClick={this.togglePreview}>{preview ? '编辑' : '预览' }</button>
        <button>匿名发送</button>
        <button>添加用户名</button>
      </div>
    );
  }
}

export default Draft;
