import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import colors from 'utils/colors';
// import fontFamilies from 'utils/fontFamilies';

import SmallCross from 'components/icons/SmallCross';

const Input = styled.input`
  @media screen and (-webkit-min-device-pixel-ratio: 0) {
    font-size: 16px;
  }

  border: none;
  outline: none;
  min-width: 0;
  ::placeholder {
    color: ${colors.regularGrey};
  }
  font-size: .75em;
  max-width: 100%;

  flex-shrink: 0;
`;

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  overflow: auto;

  min-height: 2rem;
  margin: .5rem 0rem .5rem;
  padding: 0 0 .5rem 0;
  border-bottom: 1px solid ${colors.inputGrey};
`;

const TagWrapper = styled.span`
  flex-shrink: 0

  display: inline-flex;
  align-items: center;

  background-color: ${colors.lightRed};
  color: ${colors.accentRed};
  border: 1px solid ${colors.accentRed};
  border-radius: .75rem;
  padding: .25em 1em;
  font-size: .75em;
  line-height: 1.2;
  margin: 0 .5em 0 0;
`;

const CrossWrapper = styled.button`
  border: 0;
  outline: 0;
  padding: 0;
  margin: 0 0 0 .5em;
  cursor: pointer;
  background: unset;
  line-height: 0;
  > svg {
    > path {
      stroke: ${colors.accentRed};
    }
  }
`;

class SubTagInput extends React.Component {
  state = { currentInput: '' };
  handleChange = (e) => {
    this.setState({ currentInput: e.target.value });
    // this.props.setSubTag(e);
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.submitTag();
    }
  }

  submitTag = () => {
    if (this.state.currentInput) {
      this.props.setSubTag({ type: 'add', tagName: this.state.currentInput });
      this.setState({ currentInput: '' });
    }
  }

  removeSubTag = ({ tagName }) => {
    this.props.setSubTag({ type: 'remove', tagName });
  }

  render() {
    const placeholderText = this.props.subTags.size ? `子标签(${this.props.subTags.size}/5)` : '输入子标签（可选）';
    const isDisabled = this.props.subTags.size > 4;
    return (
      <Wrapper>
        {[...this.props.subTags].map(tag => (
          <TagWrapper key={tag}>
            <span>{tag}</span>
            <CrossWrapper onClick={() => this.removeSubTag({ tagName: tag })}>
              <SmallCross />
            </CrossWrapper>
          </TagWrapper>
        )) }
        <Input placeholder={placeholderText} type="text" value={this.state.currentInput} onChange={this.handleChange} onKeyPress={this.handleKeyPress} onBlur={this.submitTag} disabled={isDisabled} />
      </Wrapper>
    );
  }
}
SubTagInput.propTypes = {
  setSubTag: PropTypes.func.isRequired,
  subTags: PropTypes.shape().isRequired,
};

export default SubTagInput;
