import React, { useState } from 'react';

import GlobalNav from '../components/GlobalNav';

import ThemeSwitcher from './ThemeSwitcher';
import Home from './Home/Home';
import Components from './ComponentExamples/Components-examples';
import Colors from './ColorsExample/Colors-examples';
import TypeExamples from './TypeExamples/Type-examples';
import Layout from './Layout/Layout-examples';

import './SodaDocs.scss';

const SodaDocs = () => {
  const defaultPage = 'Components';
  const [pageKey, setPageKey] = useState(defaultPage);

  const pages = {
    Home,
    Components,
    Colors,
    Type: TypeExamples,
    Layout,
  };

  const handleLinkClick = (link, key, e) => {
    e && e.stopPropagation();
    setPageKey(key);
  };

  const Page = pages[pageKey || defaultPage];

  return (
    <div className="v-soda_docs">
      <GlobalNav
        appName="Soda"
        links={pages}
        onLinkClick={handleLinkClick}
        activeLinkKey={pageKey}
      />
      <ThemeSwitcher />
      <main className="soda-docs-main">
        <Page />
      </main>
    </div>
  );
};

export default SodaDocs;
