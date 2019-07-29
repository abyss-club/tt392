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
import { HookedLoadingBar } from 'styles/Loading';
import { CatalogProvider } from 'providers/Catalog';
import {
  login, draft, notification, tags, refetch, scrollbar, scrollTo, slider, catalog,
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
      <HookedLoadingBar>
        <ScrollbarProvider reducer={scrollbar}>
          <ScrollToProvider reducer={scrollTo}>
            <SliderProvider reducer={slider}>
              <RefetchProvider reducer={refetch}>
                <TagsProvider reducer={tags}>
                  <DraftProvider reducer={draft}>
                    <LoginProvider reducer={login}>
                      <NotiProvider reducer={notification}>
                        <CatalogProvider reducer={catalog}>
                          <ApolloProvider client={client}>
                            <ScrollToTop>
                              <App />
                            </ScrollToTop>
                          </ApolloProvider>
                        </CatalogProvider>
                      </NotiProvider>
                    </LoginProvider>
                  </DraftProvider>
                </TagsProvider>
              </RefetchProvider>
            </SliderProvider>
          </ScrollToProvider>
        </ScrollbarProvider>
      </HookedLoadingBar>
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
