import './Type-examples.scss';

const typeScale = [
  { tag: 'h1', label: 'H1 — Display',   size: '32px', weight: '500', sample: 'The quick brown fox' },
  { tag: 'h2', label: 'H2 — Heading',   size: '21px', weight: '500', sample: 'The quick brown fox jumps' },
  { tag: 'h3', label: 'H3 — Subheading', size: '21px', weight: '500', sample: 'The quick brown fox jumps over' },
  { tag: 'h4', label: 'H4 — Title',     size: '16px', weight: '500', sample: 'The quick brown fox jumps over the lazy dog' },
  { tag: 'p',  label: 'Body',           size: '14px', weight: '400', sample: 'The quick brown fox jumps over the lazy dog. Volta provides consistent typography for all web applications.' },
  { tag: 'small', label: 'Small / Caption', size: '12px', weight: '400', sample: 'Small text used for captions, metadata, and helper text.' },
];

const fontWeights = [300, 400, 500, 600, 700];

const TypeExamples = () => (
  <section className="view-type">
    <header className="section-header">
      <h2>Typography</h2>
      <p>Volta uses SF Pro with intelligent fallbacks for non-Apple platforms.</p>
    </header>

    <div className="panel type-section">
      <h3>Font Families</h3>
      <table className="type-table">
        <thead>
          <tr><th>Role</th><th>Stack</th><th>Preview</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Body</strong></td>
            <td><code>SF Pro Text, -apple-system, Helvetica Neue</code></td>
            <td>The quick brown fox jumps over the lazy dog</td>
          </tr>
          <tr>
            <td><strong>Headings</strong></td>
            <td><code>SF Pro Display, -apple-system, Helvetica Neue</code></td>
            <td style={{ fontFamily: '"SF Pro Display", -apple-system, "Helvetica Neue", sans-serif', fontWeight: 500 }}>
              The quick brown fox
            </td>
          </tr>
          <tr>
            <td><strong>Code</strong></td>
            <td><code>Menlo, Monaco, Consolas, Courier New</code></td>
            <td><code>const value = 42;</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="panel type-section">
      <h3>Type Scale</h3>
      <div className="type-scale">
        {typeScale.map(({ tag, label, size, weight, sample }) => {
          const Tag = tag;
          return (
            <div className="type-scale-row" key={tag}>
              <div className="type-scale-meta">
                <span className="type-tag">{label}</span>
                <span className="type-specs">{size} · {weight}</span>
              </div>
              <Tag className="type-scale-sample">{sample}</Tag>
            </div>
          );
        })}
      </div>
    </div>

    <div className="panel type-section">
      <h3>Font Weights</h3>
      <div className="type-weights">
        {fontWeights.map(w => (
          <div className="type-weight-row" key={w}>
            <span className="weight-label">{w}</span>
            <span style={{ fontWeight: w }}>
              The quick brown fox jumps over the lazy dog
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="panel type-section">
      <h3>Links</h3>
      <p>
        Links use <code>$color_active</code> on hover and have no underline by default.{' '}
        <a href="#">Example link text</a> — hover to see the color change.
      </p>
    </div>

    <div className="panel type-section">
      <h3>Inline & Block Code</h3>
      <p>
        Inline code appears like <code>this.value</code> with a subtle background.
      </p>
      <code>{`const greeting = "Hello, Volta!";
console.log(greeting);`}</code>
    </div>

    <div className="panel type-section">
      <h3>Paragraph Spacing</h3>
      <p>
        Volta sets a base font size of <strong>14px</strong> with <code>-webkit-font-smoothing: antialiased</code> for crisp rendering on retina displays.
      </p>
      <p>
        Line heights default to the browser standard. For headings, <code>line-height: 1.1</code> creates tight, modern display text.
      </p>
    </div>
  </section>
);

export default TypeExamples;
