import React, { useEffect, useContext } from 'react';
import ScrollContext from 'providers/Scroll';

let ticking = false;
let lastScrollY = 0;
let diff = 0;

const ScrollContainer = () => {
  const [_, setStore] = useContext(ScrollContext);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return function cleanup() {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const handleScroll = () => {
    diff = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        setStore({
          scroll: {
            y: lastScrollY,
            diff,
          },
        });
        ticking = false;
      });

      ticking = true;
    }
  };

  return (
    <div />
  );
};

export default ScrollContainer;
