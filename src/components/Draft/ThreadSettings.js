import React, {
  useState, useContext, useCallback,
} from 'react';
import styled from 'styled-components';
import TagsContext from 'providers/Tags';
import DraftContext from 'providers/Draft';
import Cross from 'components/icons/Cross';
import Plus from 'components/icons/Plus';
import colors from 'utils/colors';

const Input = styled.input`
  border: none;
  outline: none;
  min-width: 0;
  ::placeholder {
    color: ${colors.regularGrey};
  }
`;

const TagRow = styled.div`
  display: flex;
  flex-flow: row nowrap;

  overflow-x: auto;
`;

const TitleRow = styled.div`
  display: flex;
  margin: .5rem 0 .5rem;
  padding-bottom: .25rem;
  border-bottom: 1px solid ${colors.inputGrey};
`;


const DropdownWrapper = styled.div`
  display: inline-block;
  position: relative;
  font-size: .6875em;
  margin-right: .5em;
  /* the angle-down arrow */
  :after {
    z-index: 10;
    display: block;
    content: " ";
    position: absolute;
    width: .25rem;
    height: .25rem;
    margin-top: -.375em;
    right: .625em;
    top: 50%;
    border: 1px solid white;
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
  background-color: ${colors.accentBlue};
  color: white;
  font-size: 1em;
  cursor: pointer;
  :invalid {
    color: #8E8E8E;
  }
`;

const SelectableTagWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;

  color: white;
  background-color: ${colors.tagGrey};
  font-size: .6875em;
  border-radius: .25rem;
  padding: .25em .375em .25em .5em;
  margin-right: .5em;
  line-height: 1.2;
`;

const IconWrapper = styled.button`
  display: inline-flex;
  align-items: center;

  appearance: none;
  border: 0;
  background: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
`;

const AddSubTagBtn = styled(IconWrapper)`
  display: inline-flex;
  justify-items: center;
  align-items: center;

  background-color: ${colors.tagGrey};
  font-size: .5em;
  border-radius: .25rem;
  padding: 0 .5em;

  line-height: 0;

  > svg {
    > rect {
      fill: white;
    }
  }
`;

const DelBtn = styled(IconWrapper)`
  /* hack for expanding clickable area */
  padding: 0 .5em;
  margin: 0 -.25em;
  font-size: .6875em;
`;

const ListInput = styled.input`
  color: white;
  background-color: ${colors.tagGrey};
  border: none;
  border-radius: .25rem;
  padding: 0 .5em;
  margin-right: .5em;

  font-size: .6875em;
  line-height: unset;

  appearance: none;
  cursor: pointer;

  ::placeholder {
    color: white;
  }
`;

const TitleInput = styled(Input)`
  @media screen and (-webkit-min-device-pixel-ratio:0) {
    font-size: 1em;
  }
  font-size: .875em;
  font-weight: 700;
`;

const Title = () => {
  const [{ title }, dispatch] = useContext(DraftContext);
  const titleOnChange = useCallback((e) => {
    dispatch({ type: 'SET_TITLE', title: e.target.value });
  }, [dispatch]);
  return (
    <TitleRow>
      <TitleInput type="text" value={title} onChange={titleOnChange} placeholder="标题（可选）" />
    </TitleRow>
  );
};

const ThreadSettings = () => {
  const [{ mainTag, subTags }, dispatch] = useContext(DraftContext);
  const [showAddBtn, setShowAddBtn] = useState(false);
  const [{ tags }] = useContext(TagsContext);
  const setSubTag = useCallback(({ type, tagName }) => {
    const prevSet = new Set(subTags);
    if (type === 'remove') prevSet.delete(tagName);
    else if (type === 'add') prevSet.add(tagName);
    dispatch({ type: 'SET_SUBTAGS', subTags: prevSet });
  }, [dispatch, subTags]);

  const tagSelectOnChange = useCallback((e) => {
    dispatch({ type: 'SET_MAINTAG', mainTag: e.target.value });
  }, [dispatch]);

  const listInputOnKeyUp = useCallback((e) => {
    if (e.key === 'Enter' && e.target.value) {
      setSubTag({ type: 'add', tagName: e.target.value });
      setShowAddBtn(true);
    }
  }, [setSubTag]);

  const listInputOnBlur = useCallback((e) => {
    if (e.target.value) {
      setSubTag({ type: 'add', tagName: e.target.value });
      setShowAddBtn(true);
    }
  }, [setSubTag]);

  const delBtnOnClick = useCallback((tag) => {
    setSubTag({ type: 'remove', tagName: tag });
    setShowAddBtn(true);
  }, [setSubTag]);

  const addSubBtnOnClick = useCallback(() => {
    setShowAddBtn(false);
  }, []);

  const listSelect = (
    <>
      <ListInput list="subTags" name="subTags selection" placeholder="选择或输入子标签..." onKeyUp={listInputOnKeyUp} onBlur={listInputOnBlur} />
      <datalist id="subTags">
        {[...tags.subTags].map(tag => (
          <option value={tag} key={tag} />
        ))}
      </datalist>
    </>
  );
  return (
    <div>
      <TagRow>
        <DropdownWrapper>
          <Dropdown value={mainTag} onChange={tagSelectOnChange}>
            <option>选择主标签…</option>
            {[...tags.mainTags].map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </Dropdown>
        </DropdownWrapper>
        {[...subTags].map(tag => (
          <SelectableTagWrapper key={tag}>
            {tag}
            <DelBtn onClick={() => delBtnOnClick(tag)}>
              <Cross />
            </DelBtn>
          </SelectableTagWrapper>
        ))}
        {showAddBtn ? (
          <AddSubTagBtn onClick={addSubBtnOnClick}>
            <Plus />
          </AddSubTagBtn>
        ) : listSelect}
      </TagRow>
      <Title />
    </div>
  );
};

export default ThreadSettings;
