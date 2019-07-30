import React, { useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { useInView } from 'react-intersection-observer';
import { LoadMore } from 'styles/Loading';
import { OffsetPosContext } from 'components/ThreadView/Thread';

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
  entries, onLoadMore, loading, children, catalog,
}) => {
  const [posMap] = useContext(OffsetPosContext);

  const [afterRef, afterInView] = useInView({
    threshold: 1.0,
  });
  const [beforeRef, beforeInView] = useInView({
    threshold: 1.0,
  });

  const prevAfterInView = useRef(null);
  const prevBeforeInView = useRef(null);

  useEffect(() => {
    if (!loading && !prevAfterInView.current && afterInView) {
      console.log('loadmore after');
      onLoadMore({ type: 'after' });
    }
    prevAfterInView.current = afterInView;
  }, [afterInView, loading, onLoadMore]);

  useEffect(() => {
    if (!loading && !prevBeforeInView.current && beforeInView) {
      console.log('loadmore before');
      if (entries.length < 1) {
        onLoadMore({ type: 'before' });
      } else {
        const curTopId = entries[0].id;
        const topOffset = posMap.get(curTopId);
        onLoadMore({ type: 'before' });
        window.scrollTo({
          behavior: 'auto',
          top: topOffset - 48,
        });
      }
    }
    prevBeforeInView.current = beforeInView;
  }, [beforeInView, entries, loading, onLoadMore, posMap]);

  if (!entries || catalog.length < 1) return <LoadMore />;
  // console.log({ catalog: catalog[0].postId, entries: entries[0].id });
  return (
    <>
      {!loading && (entries.length < 1 || catalog[0].postId !== entries[0].id)
        && <LoadMore ref={!loading ? beforeRef : null} />
      }
      {children}
      {entries.length > 0 && catalog.slice(-1)[0].postId !== entries.slice(-1)[0].id
        && <LoadMore ref={!loading ? afterRef : null} />
      }
    </>
  );
};
ScrollForMorePosts.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })).isRequired,
  onLoadMore: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  // hasNext: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  catalog: PropTypes.arrayOf(PropTypes.shape({
    postId: PropTypes.string.isRequired,
  })).isRequired,
};

export default ScrollForMore;
export { ScrollForMorePosts };
