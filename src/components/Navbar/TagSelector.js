import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';

import Query from 'components/Query';
import Tag from 'components/Tag';

const Wrapper = styled.div`
  margin-top: .5rem;
  > p {
    margin: 0;
  }
`;

const SelectableTagWrapper = styled.div`
  margin: -0.125rem;
  margin-top: .5rem;
  display: flex;
  flex-flow: row wrap;
`;

const TagInList = styled(Tag)`
  margin: .125rem;
`;

const flatSubTags = (tree) => {
  const subTags = new Set();
  tree.forEach((node) => {
    (node.subTags || []).forEach(tag => subTags.add(tag));
  });
  return subTags;
};

class TagSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subTags: flatSubTags(this.props.tree),
    };
  }
  render() {
    const { mainTags, subscribed, setTagStatus } = this.props;
    const { subTags } = this.state;
    // const main = [...mainTags].filter(tag => !subscribed.main.has(tag));
    // const sub = [...subTags].filter(tag => !subscribed.sub.has(tag));
    const SelectableTag = ({ tag, isMain = false, selected = false }) => (
      <TagInList
        key={tag}
        text={tag}
        isMain={isMain}
        selected={selected}
        onClick={() => { setTagStatus({ tag, isMain, isAdd: !selected }); }}
      />
    );
    return (
      <Wrapper>
        {/* <p>点击下列标签订阅，点击上述标签取消</p> */}
        <SelectableTagWrapper>
          {/* {main.map(tag => UnSubbedTag(tag, true))}
          {sub.map(tag => UnSubbedTag(tag))} */}
          {[...mainTags].map(tag => (subscribed.main.has(tag) ?
            SelectableTag({ tag, isMain: true, selected: true }) :
            SelectableTag({ tag, isMain: true }))) }
          {[...subTags].map(tag => (subscribed.sub.has(tag) ?
            SelectableTag({ tag, selected: true }) :
            SelectableTag({ tag }))) }
        </SelectableTagWrapper>
      </Wrapper>
    );
  }
}
TagSelector.propTypes = {
  tree: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  mainTags: PropTypes.shape().isRequired,
  subscribed: PropTypes.shape().isRequired,
  setTagStatus: PropTypes.func.isRequired,
};

const TAG_TREE = gql`
  query {
    tags {
      tree {mainTag, subTags}
    }
  }
`;

export default props => (
  <Query query={TAG_TREE}>
    {({ data }) => (
      <TagSelector tree={data.tags.tree} {...props} />
    )}
  </Query>
);
