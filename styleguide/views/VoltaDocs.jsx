import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { SegmentedControl } from '../../components';

import Logo from './Logo';
import ThemeSwitcher from './ThemeSwitcher';
import Home from './Home/Home';
import Components from './ComponentExamples/Components-examples';
import Colors from './ColorsExample/Colors-examples';
import TypeExamples from './TypeExamples/Type-examples';
import Layout from './Layout/Layout-examples';
import Icons from './Icons/Icons';
import Naming from './Naming/Naming';
import Examples from './Examples/Examples';

import './VoltaDocs.scss';

const pages = {
  Home,
  Components,
  Examples,
  Icons,
  Colors,
  Type: TypeExamples,
  Layout,
  Naming,
};

const defaultPage = 'Home';

// The page lives in the URL path (/components) so a refresh, the back button
// and a pasted link all land on the same page. Links from before the path
// routing (#components) still work: the hash is moved into the path on load.
const pageFromPath = () => {
  const name = (window.location.pathname.replace(/^\/+|\/+$/g, '') || window.location.hash.replace(/^#\/?/, '')).toLowerCase();
  return Object.keys(pages).find((key) => key.toLowerCase() === name) || defaultPage;
};

const VoltaDocs = () => {
  const [pageKey, setPageKey] = useState(() => {
    const key = pageFromPath();
    if (window.location.hash) window.history.replaceState(null, '', `/${key === defaultPage ? '' : key.toLowerCase()}`);
    return key;
  });
  const rootRef = useRef(null);
  const headerRef = useRef(null);

  // The header wraps to two rows on narrow screens, so pages that stick below it
  // or fill the rest of the window read its real height from this variable.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const header = headerRef.current;
    const update = () => root.style.setProperty('--docs-header-height', `${header.offsetHeight}px`);
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onPopState = () => setPageKey(pageFromPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // A new page starts at the top instead of wherever the last one was scrolled to.
  const showPage = (key) => {
    window.history.pushState(null, '', key === defaultPage ? '/' : `/${key.toLowerCase()}`);
    setPageKey(key);
    window.scrollTo(0, 0);
  };

  const Page = pages[pageKey];

  return (
    <div className="v-docs" ref={rootRef}>
      <header className="v-docs-header" ref={headerRef}>
        <button className="v-docs-brand" type="button" onClick={() => showPage('Home')}>
          <Logo />
          <span>
            <strong>Volta</strong>
            <small>Component library</small>
          </span>
        </button>

        <SegmentedControl
          navigation
          size="sm"
          className="v-docs-nav"
          ariaLabel="Styleguide sections"
          value={pageKey}
          onChange={showPage}
          options={Object.keys(pages).map((key) => ({ label: key, value: key }))}
        />

        <ThemeSwitcher />
      </header>

      <main className={`v-docs-main v-docs-main--${pageKey.toLowerCase()}`}>
        <Page />
      </main>
    </div>
  );
};

export default VoltaDocs;
