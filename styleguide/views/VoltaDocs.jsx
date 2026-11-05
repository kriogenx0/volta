import React, { useLayoutEffect, useRef, useState } from 'react';

import ThemeSwitcher from './ThemeSwitcher';
import Home from './Home/Home';
import Components from './ComponentExamples/Components-examples';
import Colors from './ColorsExample/Colors-examples';
import TypeExamples from './TypeExamples/Type-examples';
import Layout from './Layout/Layout-examples';

import './VoltaDocs.scss';

const VoltaDocs = () => {
  const defaultPage = 'Home';
  const [pageKey, setPageKey] = useState(defaultPage);
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

  // A new page starts at the top instead of wherever the last one was scrolled to.
  const showPage = (key) => {
    setPageKey(key);
    window.scrollTo(0, 0);
  };

  const pages = {
    Home,
    Components,
    Colors,
    Type: TypeExamples,
    Layout,
  };

  const Page = pages[pageKey || defaultPage];

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

        <nav className="v-docs-nav" aria-label="Styleguide sections">
          {Object.keys(pages).map((key) => (
            <button
              className={pageKey === key ? 'active' : ''}
              type="button"
              aria-current={pageKey === key ? 'page' : undefined}
              onClick={() => showPage(key)}
              key={key}
            >
              {key}
            </button>
          ))}
        </nav>

        <ThemeSwitcher />
      </header>

      <main className={`v-docs-main v-docs-main--${pageKey.toLowerCase()}`}>
        <Page />
      </main>
    </div>
  );
};

export default VoltaDocs;
