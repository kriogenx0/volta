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
      <code>{`.l-width { max-width: 1200px; margin: 0 auto; padding: 0 32px; }`}</code>
    </div>

    <div className="panel">
      <h3>Row Layout</h3>
      <p>Use <code>.l-row</code> for a horizontal flex container with <code>align-items: center</code>.</p>
      <div className="l-row" style={{ gap: 8, padding: '8px 0' }}>
        <div style={{ background: '#4A90E2', color: '#fff', padding: '8px 16px', borderRadius: 4 }}>Item 1</div>
        <div style={{ background: '#4A90E2', color: '#fff', padding: '8px 16px', borderRadius: 4 }}>Item 2</div>
        <div style={{ background: '#4A90E2', color: '#fff', padding: '8px 16px', borderRadius: 4 }}>Item 3</div>
      </div>
      <code>{`<div className="l-row">...</div>`}</code>
    </div>

    <div className="panel">
      <h3>Spacing</h3>
      <p>Use <code>.m-y</code> for vertical margin, <code>.p-y</code> for vertical padding. Volta uses a base spacing unit of 8px.</p>
    </div>

    <div className="panel">
      <h3>Responsive Breakpoints</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px 12px', background: '#f2f2f2' }}>Mixin</th>
            <th style={{ textAlign: 'left', padding: '8px 12px', background: '#f2f2f2' }}>Breakpoint</th>
            <th style={{ textAlign: 'left', padding: '8px 12px', background: '#f2f2f2' }}>Usage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #e6e6e6' }}><code>@include mobile</code></td>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #e6e6e6' }}><code>max-width: 640px</code></td>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #e6e6e6' }}>Phones</td>
          </tr>
          <tr>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #e6e6e6' }}><code>@include large</code></td>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #e6e6e6' }}><code>min-width: 1260px</code></td>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #e6e6e6' }}>Large desktops</td>
          </tr>
          <tr>
            <td style={{ padding: '10px 12px' }}><code>@include dark</code></td>
            <td style={{ padding: '10px 12px' }}><code>prefers-color-scheme: dark</code></td>
            <td style={{ padding: '10px 12px' }}>Dark mode</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
);

export default Layout;
