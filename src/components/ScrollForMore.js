import React, { useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { useInView } from 'react-intersection-observer';
import { LoadMore } from 'styles/Loading';
import CatalogContext from 'providers/Catalog';

const ScrollForMore = ({
  entries, onLoadMore, loading, hasNext, children,
}) => {
  const [afterRef, afterInView] = useInView({
    threshold: 1.0,
  });

  const prevAfterInView = useRef(false);
  useEffect(() => {
    if (!prevAfterInView.current && afterInView) {
      onLoadMore({ type: 'after' });
    }
    prevAfterInView.current = afterInView;
  }, [afterInView, onLoadMore]);

  if (!entries || loading) return <LoadMore />;
  return (
    <>
      {children}
      {hasNext && (
        <LoadMore ref={afterRef} />
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

const ScrollForMorePosts = ({
  entries, onLoadMore, loading, hasNext, children, catalog,
}) => {
  const [afterRef, afterInView] = useInView({
    threshold: 1.0,
  });
  const [beforeRef, beforeInView] = useInView({
    threshold: 1.0,
  });

  const prevAfterInView = useRef(null);
  const prevBeforeInView = useRef(null);

  useEffect(() => {
    if (!prevAfterInView.current && afterInView) {
      onLoadMore({ type: 'after' });
    }
    prevAfterInView.current = afterInView;
  }, [afterInView, onLoadMore]);

  useEffect(() => {
    const curPos = prevBeforeInView.current ? prevBeforeInView.current.offsetTop : 0;
    if (!prevBeforeInView.current && beforeInView) {
      onLoadMore({ type: 'before' });
      // window.scrollTo({
      //   behavior: 'auto',
      //   top: curPos,
      // });
    }
    prevBeforeInView.current = beforeInView;
  }, [beforeInView, onLoadMore]);

  if (!entries || loading) return <LoadMore />;
  // console.log({ catalog: catalog[0].postId, entries: entries[0].id });
  return (
    <>
      {catalog[0].postId !== entries[0].id
        && <LoadMore ref={beforeRef} />
      }
      {children}
      {hasNext
        && <LoadMore ref={afterRef} />
      }
    </>
  );
};
ScrollForMorePosts.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onLoadMore: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  hasNext: PropTypes.bool.isRequired,
  hasBefore: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  catalog: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default ScrollForMore;
export { ScrollForMorePosts };
