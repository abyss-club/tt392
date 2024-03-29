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
  faAngleDoubleUp,
  faAngleDoubleDown,
  faUnlock,
  faLock,
  faBan,
} from '@fortawesome/free-solid-svg-icons';

const faLib = {
  loadFa: () => {
    library.add(
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
      faAngleDoubleUp,
      faAngleDoubleDown,
      faUnlock,
      faLock,
      faBan,
    );
  },
};

export default faLib;
