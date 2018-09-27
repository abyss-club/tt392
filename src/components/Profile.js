import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import colors from 'utils/colors';

import Query from 'components/Query';
import Tick from 'components/icons/Tick';
import NavTags from 'components/Navbar/NavTags';
import MainContent from 'styles/MainContent';

const PROFILE_QUERY = gql`
  query FetchProfile {
    profile {
      email
      name
    }
  }
`;

const UPDATE_NAME = gql`
  mutation UpdateName($name: String!) {
    setName(name: $name) {
      name
    }
  }
`;

const NameForm = styled.form`
  width: 100%;
  height: 2rem;

  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  border: 1px solid ${colors.setNameBorderGrey};
  border-radius: 1rem;
  padding: 0em .25rem 0 1rem;
`;

const NameInput = styled.input`
  flex-grow: 2;

  width: 100%;
  font-size: .75em;
  text-align: start;
  border: none;
  outline: none;
  background-color: unset;
  height: 100%;
  padding: 0;
  appearance: none;
  color: ${colors.tagGrey};

  :focus {
    text-align: start;
    color: white;
  }
`;

const SubmitBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  background-color: ${colors.tagRed};
  color: #fff;
  border-radius: 50%;
  height: 1.5rem;
  width: 1.5rem;
  outline: none;
  border: none;

  cursor: pointer;

  :disabled {
    background-color: ${colors.tagGrey};
  }

  > svg {
    > path {
      stroke: white;
    }
  }
`;

const Wrapper = styled(MainContent)`
  color: white;
`;

const NameRow = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0 1rem;
  margin: .75rem 0 1.8rem;
`;

const TitleText = styled.h4`
  font-weight: 600;
  font-size: 1.25em;
`;

const SetNameBtn = styled.button`
  color: ${colors.tagGrey};
  appearance: none;
  border: 1px solid ${colors.setNameBorderGrey};
  border-radius: 2rem;
  background: none;
  outline: none;
  cursor: pointer;
  padding: 0 1rem;
  margin: 0 0 0 auto;
  height: 2rem;

  font-size: .75em;
`;

const TagRow = styled.div`

`;

const TagText = styled.div`
  padding: 0 0 .45rem 1rem;
  color: ${colors.tagGrey};
  font-size: .75em;
`;

const ErrInfo = styled.p`
  width: 100%;
  color: white;
`;

// TODO: use Store will be clear
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      remoteName: props.queryData.profile.name,
      inputName: '',
      status: 'INIT',
      error: '',
      disabled: false,
      showInput: false,
    };
  }

  handleChange = (e) => {
    this.setState({ inputName: e.target.value });
  }

  submitName = (e) => {
    e.preventDefault();
    this.setState({ disabled: true });
    this.props.setName({ variables: { name: this.state.inputName } }).then(({ data, errors }) => {
      // TODO: Cleanup these
      if (data.setName.name) {
        this.setState({ status: 'COMPLETE', remoteName: data.setName.name, disabled: false });
      } else {
        this.setState({ status: 'ERROR', error: errors[0].message, disabled: false });
      }
    }).catch(() => {
      this.setState({ status: 'ERROR', disabled: false });
    });
    if (this.state.inputName) {
      this.setState({ inputName: '' });
    }
  }

  render() {
    const {
      remoteName, inputName, showInput, disabled,
    } = this.state;
    const firstRow = remoteName ? (
      <NameRow>
        <TitleText>{remoteName}</TitleText>
      </NameRow>
    ) : (
      <NameRow>
        {showInput ? (
          <NameForm autoComplete="off" onSubmit={this.submitName}>
            <NameInput autoComplete="false" spellCheck="false" autoCapitalize="none" type="text" name="name" placeholder="用户名" onChange={this.handleChange} value={inputName} />
            <SubmitBtn type="submit" title="提交" name={inputName} disabled={!inputName || disabled}><Tick /></SubmitBtn>
          </NameForm>
        ) : (
          <React.Fragment>
            <TitleText>个人中心</TitleText>
            <SetNameBtn onClick={() => { this.setState({ showInput: true }); }}>点击设置用户名</SetNameBtn>
          </React.Fragment>
        ) }
      </NameRow>
    );
    return (
      <Wrapper>
        {firstRow}
        {(this.state.status === 'ERROR') && (<ErrInfo>错误：{this.state.error}</ErrInfo>)}
        <TagRow>
          <TagText>已关注标签</TagText>
          <NavTags />
        </TagRow>
      </Wrapper>
    );
  }
}
Profile.propTypes = {
  queryData: PropTypes.shape({
    profile: PropTypes.shape({
      email: PropTypes.string.isRequired,
      name: PropTypes.string,
    }),
  }),
  setName: PropTypes.func.isRequired,
};
Profile.defaultProps = {
  queryData: {
    profile: {
      name: null,
    },
  },
};

export default props => (
  <Query query={PROFILE_QUERY}>
    {({ data }) => (
      <Mutation mutation={UPDATE_NAME} refetchQueries={['FetchProfile']}>
        {(setName, { data: mutData, errors }) => (
          <Profile
            {...props}
            setName={setName}
            mutData={mutData}
            mutError={errors}
            queryData={data}
          />
        )}
      </Mutation>
      )}
  </Query>
);
