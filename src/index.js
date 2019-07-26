import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';

import App from 'App';
import client from 'providers/client';
import { NotiProvider } from 'providers/Noti';
import { LoginProvider } from 'providers/Login';
import { DraftProvider } from 'providers/Draft';
import { TagsProvider } from 'providers/Tags';
import { RefetchProvider } from 'providers/Refetch';
import { ScrollbarProvider } from 'providers/Scrollbar';
import { SliderProvider } from 'providers/Slider';
import { ScrollToProvider } from 'providers/ScrollTo';
import { LoadingProvider } from 'providers/Loading';
import { CatalogProvider } from 'providers/Catalog';
import {
  login, draft, notification, tags, refetch, scrollbar, scrollTo, slider, loading, catalog,
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

const Root = () => (
  <React.StrictMode>
    <HookedBrowserRouter>
      <ScrollbarProvider reducer={scrollbar}>
        <ScrollToProvider reducer={scrollTo}>
          <SliderProvider reducer={slider}>
            <RefetchProvider reducer={refetch}>
              <TagsProvider reducer={tags}>
                <DraftProvider reducer={draft}>
                  <LoginProvider reducer={login}>
                    <NotiProvider reducer={notification}>
                      <LoadingProvider reducer={loading}>
                        <CatalogProvider reducer={catalog}>
                          <ApolloProvider client={client}>
                            <ScrollToTop>
                              <App />
                            </ScrollToTop>
                          </ApolloProvider>
                        </CatalogProvider>
                      </LoadingProvider>
                    </NotiProvider>
                  </LoginProvider>
                </DraftProvider>
              </TagsProvider>
            </RefetchProvider>
          </SliderProvider>
        </ScrollToProvider>
      </ScrollbarProvider>
    </HookedBrowserRouter>
  </React.StrictMode>
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
