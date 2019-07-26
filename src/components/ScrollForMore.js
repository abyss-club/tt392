import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useInView } from 'react-intersection-observer';
import { LoadMore } from 'styles/Loading';

const ScrollForMore = ({
  entries, onLoadMore, loading, hasNext, children,
}) => {
  const [ref, inView] = useInView({
    threshold: 1.0,
  });

  const prevInView = useRef(false);
  useEffect(() => {
    if (!prevInView.current && inView) {
      onLoadMore();
    }
    prevInView.current = inView;
  }, [inView, onLoadMore]);
  if (!entries || loading) return <LoadMore />;
  return (
    <>
      {children}
      {hasNext && (
        <LoadMore ref={ref} />
      )}
    </>
  );
};
ScrollForMore.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onLoadMore: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  hasNext: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default ScrollForMore;
