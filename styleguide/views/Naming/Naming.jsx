import { conventions, principles, systemRules } from './conventions';

import './Naming.scss';

const Names = ({ names, kind }) => (
  <ul className={`naming-names naming-names--${kind}`} aria-label={kind === 'prefer' ? 'Preferred' : 'Avoid'}>
    {names.map((name) => <li key={name}><code>{name}</code></li>)}
  </ul>
);

const Naming = () => (
  <div className="view-naming">
    <div className="naming-hero">
      <span className="naming-eyebrow">Conventions</span>
      <h1>Naming and principles</h1>
      <p className="naming-tagline">
        How things are named in Volta, and the design principles every component and page is held to.
        The short name wins: it is <code>TextBox</code>, not <code>TextField</code>, because Box is shorter.
      </p>
    </div>

    <section className="naming-section" aria-label="Naming conventions">
      <h2>Naming conventions</h2>
      {conventions.map((convention) => (
        <article className="naming-card" key={convention.title}>
          <h3>{convention.title}</h3>
          <p>{convention.body}</p>
          {(convention.prefer || convention.avoid) && (
            <div className="naming-compare">
              {convention.prefer && (
                <div>
                  <span className="naming-label naming-label--prefer">Prefer</span>
                  <Names names={convention.prefer} kind="prefer" />
                </div>
              )}
              {convention.avoid && (
                <div>
                  <span className="naming-label naming-label--avoid">Avoid</span>
                  <Names names={convention.avoid} kind="avoid" />
                </div>
              )}
            </div>
          )}
          {convention.note && <p className="naming-note">{convention.note}</p>}
        </article>
      ))}
    </section>

    <section className="naming-section" aria-label="Design principles">
      <h2>Design principles</h2>
      <p className="naming-intro">These apply to every page, feature and task; work isn&rsquo;t done until it meets them.</p>
      <ol className="naming-list">
        {principles.map((principle) => <li key={principle}>{principle}</li>)}
      </ol>
      <h3 className="naming-subhead">Volta design system</h3>
      <ul className="naming-list">
        {systemRules.map((rule) => <li key={rule}>{rule}</li>)}
      </ul>
    </section>
  </div>
);

export default Naming;
