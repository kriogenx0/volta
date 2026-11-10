import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { SegmentedControl } from '../../components';

import ThemeSwitcher from './ThemeSwitcher';
import Home from './Home/Home';
import Components from './ComponentExamples/Components-examples';
import Colors from './ColorsExample/Colors-examples';
import TypeExamples from './TypeExamples/Type-examples';
import Layout from './Layout/Layout-examples';
import Naming from './Naming/Naming';

import './VoltaDocs.scss';

const pages = {
  Home,
  Components,
  Colors,
  Type: TypeExamples,
  Layout,
  Naming,
};

const defaultPage = 'Home';

// The page lives in the URL hash (#components) so a refresh, the back button
// and a pasted link all land on the same page.
const pageFromHash = () => {
  const name = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  return Object.keys(pages).find((key) => key.toLowerCase() === name) || defaultPage;
};

const VoltaDocs = () => {
  const [pageKey, setPageKey] = useState(pageFromHash);
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
    const onHashChange = () => setPageKey(pageFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // A new page starts at the top instead of wherever the last one was scrolled to.
  const showPage = (key) => {
    window.location.hash = key.toLowerCase();
    setPageKey(key);
    window.scrollTo(0, 0);
  };

  const Page = pages[pageKey];

  return (
    <div className="v-docs" ref={rootRef}>
      <header className="v-docs-header" ref={headerRef}>
        <button className="v-docs-brand" type="button" onClick={() => showPage('Home')}>
          <span className="v-docs-brand_mark" aria-hidden="true">V</span>
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
