import Code from '../../../components/Code';

import './Layout-examples.scss';

const Layout = () => (
  <section className="view-layout">
    <header className="section-header">
      <div>
        <h2>Layout</h2>
        <p>Volta provides utility classes and layout components for consistent page structure.</p>
      </div>
    </header>

    <div className="panel">
      <h3>Width Container</h3>
      <p>Use <code>.l-width</code> to constrain content to a readable max-width with auto horizontal margins.</p>
      <Code language="scss">{`.l-width { max-width: 1200px; margin: 0 auto; padding: 0 32px; }`}</Code>
    </div>

    <div className="panel">
      <h3>Row Layout</h3>
      <p>Use <code>.l-row</code> for a horizontal flex container with <code>align-items: center</code>.</p>
      <div className="l-row layout-demo_row">
        <div className="layout-demo_item">Item 1</div>
        <div className="layout-demo_item">Item 2</div>
        <div className="layout-demo_item">Item 3</div>
      </div>
      <Code>{`<div className="l-row">...</div>`}</Code>
    </div>

    <div className="panel">
      <h3>Spacing</h3>
      <p>Use <code>.m-y</code> for vertical margin, <code>.p-y</code> for vertical padding. Volta uses a base spacing unit of 8px.</p>
    </div>

    <div className="panel">
      <h3>Responsive Breakpoints</h3>
      <table className="layout-table">
        <thead>
          <tr>
            <th>Mixin</th>
            <th>Breakpoint</th>
            <th>Usage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>@include mobile</code></td>
            <td><code>max-width: 640px</code></td>
            <td>Phones</td>
          </tr>
          <tr>
            <td><code>@include large</code></td>
            <td><code>min-width: 1260px</code></td>
            <td>Large desktops</td>
          </tr>
          <tr>
            <td><code>@include dark</code></td>
            <td><code>prefers-color-scheme: dark</code></td>
            <td>Dark mode</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
);

export default Layout;
