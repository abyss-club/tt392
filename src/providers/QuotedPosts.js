import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const QuotedPostsContext = createContext([]);
const QuotedPostsProvider = ({ children }) => {
  const [quotedPosts, setQuotedPosts] = useState(new Set());
  return (
    <QuotedPostsContext.Provider value={[quotedPosts, setQuotedPosts]}>
      {children}
    </QuotedPostsContext.Provider>
  );
};
QuotedPostsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default QuotedPostsContext;
export { QuotedPostsProvider };
