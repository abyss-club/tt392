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
} from '@fortawesome/free-solid-svg-icons';

const faLib = {
  loadFa: () => {
    // eslint-disable-next-line max-len
    library.add(faCheckSquare, faCoffee, faLink, faImage, faTimes, faSpinner, faUser, faPlusSquare, faBars);
  },
};

export default faLib;
