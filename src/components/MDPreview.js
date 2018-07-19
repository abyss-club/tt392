import React from 'react';
import styled from 'styled-components';
import Remarkable from 'remarkable';
import RemarkableReactRenderer from 'remarkable-react';

const md = new Remarkable();
md.renderer = new RemarkableReactRenderer();

const MDPreview = props => (
  md.render(props.texts[0])
);

export default MDPreview;
