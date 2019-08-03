import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';

import App from 'App';
import client from 'providers/client';
import { NotiProvider } from 'providers/Noti';
import { LoginProvider } from 'providers/Login';
import { DraftProvider } from 'providers/Draft';
import { TagsProvider } from 'providers/Tags';
import { QuotedPostsProvider } from 'providers/QuotedPosts';
import { OffsetPosProvider } from 'providers/OffsetPos';
import { RefetchProvider } from 'providers/Refetch';
import { HookedLoadingBar } from 'styles/Loading';
import {
  login, draft, notification, tags, refetch,
} from 'reducers';
import { HookedBrowserRouter } from 'utils/routerHooks';
import ScrollToTop from 'utils/scrollToTop';
import * as serviceWorker from './serviceWorker';

import 'normalize.css';
import 'typeface-roboto-mono';
import './index.css';

// This is for a11y issue detection
// if (process.env.NODE_ENV !== 'production') {
//   // eslint-disable-next-line global-require, import/no-extraneous-dependencies
//   const axe = require('react-axe');
//   axe(React, ReactDOM, 5000);
// }

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

const Root = () => (
  <>
    <HookedBrowserRouter>
      <HookedLoadingBar>
        <RefetchProvider reducer={refetch}>
          <TagsProvider reducer={tags}>
            <DraftProvider reducer={draft}>
              <LoginProvider reducer={login}>
                <NotiProvider reducer={notification}>
                  <QuotedPostsProvider>
                    <OffsetPosProvider>
                      <ApolloProvider client={client}>
                        <ScrollToTop>
                          <App />
                        </ScrollToTop>
                      </ApolloProvider>
                    </OffsetPosProvider>
                  </QuotedPostsProvider>
                </NotiProvider>
              </LoginProvider>
            </DraftProvider>
          </TagsProvider>
        </RefetchProvider>
      </HookedLoadingBar>
    </HookedBrowserRouter>
  </>
);

ReactDOM.render(<Root />, document.getElementById('root'));
serviceWorker.register();

/**
 * Do feature detection, to figure out which polyfills needs to be imported.
 * */
async function loadPolyfills() {
  if (typeof window.IntersectionObserver === 'undefined') {
    await import('intersection-observer');
  }
}
loadPolyfills();
