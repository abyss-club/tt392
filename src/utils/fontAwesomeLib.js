import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCheckSquare,
  faCoffee,
  faLink,
  faImage,
  faTimes,
  faSpinner,
  faUser,
  faPlusSquare,
  faBars,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';

const faLib = {
  loadFa: () => {
    // eslint-disable-next-line max-len
    library.add(faCheckSquare, faCoffee, faLink, faImage, faTimes, faSpinner, faUser, faPlusSquare, faBars, faChevronDown, faChevronUp);
  },
};

export default faLib;
