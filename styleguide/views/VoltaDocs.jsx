import React, { useState } from 'react';

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

  const pages = {
    Home,
    Components,
    Colors,
    Type: TypeExamples,
    Layout,
  };

  const Page = pages[pageKey || defaultPage];

  return (
    <div className="v-docs">
      <header className="v-docs-header">
        <button className="v-docs-brand" type="button" onClick={() => setPageKey('Home')}>
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
              onClick={() => setPageKey(key)}
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
