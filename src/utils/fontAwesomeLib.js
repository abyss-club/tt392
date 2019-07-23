import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCheckSquare,
  faSquare,
  faCoffee,
  faLink,
  faImage,
  faTimes,
  faSpinner,
  faUser,
  faPlus,
  faPlusSquare,
  faBars,
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faQuoteLeft,
  faComment,
  faDiceOne,
  faDiceTwo,
  faDiceThree,
  faCheck,
  faReply,
  faSort,
} from '@fortawesome/free-solid-svg-icons';

const faLib = {
  loadFa: () => {
    // eslint-disable-next-line max-len
    library.add(faCheckSquare, faSquare, faCoffee, faLink, faImage, faTimes, faSpinner, faUser, faPlus, faPlusSquare, faBars, faChevronDown, faChevronUp, faChevronLeft, faQuoteLeft, faComment, faDiceOne, faDiceTwo, faDiceThree, faCheck, faReply, faSort);
  },
};

export default faLib;
