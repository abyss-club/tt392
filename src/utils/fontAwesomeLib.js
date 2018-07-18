import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons';

const faLib = {
  loadFa: () => { library.add(faCheckSquare, faCoffee); },
};

export default faLib;
