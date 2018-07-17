import Remarkable from 'remarkable';
import RemarkableReactRenderer from 'remarkable-react';

const md = new Remarkable();
md.renderer = new RemarkableReactRenderer();

const MDPreview = props => (
  props.texts.map(text => md.render(text))
);

export default MDPreview;
