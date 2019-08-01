import React, {
  useEffect, useRef, useContext, useState, useLayoutEffect,
} from 'react';
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
  const [scrollLoc, setScrollLoc] = useState(0);
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
      onLoadMore({ type: 'after' });
    }
    prevAfterInView.current = afterInView;
  }, [afterInView, loading, onLoadMore]);

  useLayoutEffect(() => {
    if (loading && beforeInView) {
      setScrollLoc(document.body.scrollHeight - window.scrollY);
    }
  }, [beforeInView, loading, posMap]);

  useLayoutEffect(() => {
    if (!loading && !prevBeforeInView.current && beforeInView) {
      console.log('loadmore before');
      if (entries.length < 1) {
        onLoadMore({ type: 'before' });
      } else {
        onLoadMore({ type: 'before' });
        // window.scrollTo({
        //   behavior: 'auto',
        //   top: document.body.scrollHeight - curScrollPos - 48,
        // });
      }
    }
    if (prevBeforeInView.current && beforeInView) {
      if (entries.length < 1 || catalog[0].postId !== entries[0].id) {
        window.scrollTo({
          behavior: 'auto',
          // top: document.body.scrollHeight - curScrollPos - 48,
          top: document.body.scrollHeight - scrollLoc - 48,
        });
      }
    }
    prevBeforeInView.current = beforeInView;
  }, [beforeInView, entries, loading, onLoadMore, posMap, catalog, scrollLoc]);

  if (catalog.length === 0) return null;
  if (!entries) return <LoadMore />;
  return (
    <>
      {(entries.length < 1 || catalog[0].postId !== entries[0].id)
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
