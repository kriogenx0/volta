// The page the Components view opens on: every component, grouped as the sidebar groups
// them, each a tile that opens its examples.

// The first sentence of a description, cut short so every tile is about the same height
const summary = (description) => {
  const first = String(description || '').split(/(?<=[.!?])\s/)[0];
  return first.length > 120 ? `${first.slice(0, 117).trimEnd()}…` : first;
};

const ComponentOverview = ({ groups, componentsByName, onSelect, filtered }) => {
  const total = groups.reduce((sum, group) => sum + group.components.length, 0);

  return (
    <section className="component-doc component_overview">
      <header className="component-doc-header">
        <h2>Components</h2>
        <p className="component-doc-description">
          {filtered
            ? `${total} ${total === 1 ? 'component matches' : 'components match'} your search.`
            : `${total} components in ${groups.length} groups. Choose one to see its examples.`}
        </p>
      </header>

      {groups.map((group) => (
        <section className="component_overview-group" key={group.label} aria-label={group.label}>
          <h3>{group.label}</h3>
          <div className="component_overview-grid">
            {group.components.map((name) => (
              <button type="button" className="component_overview-tile" key={name} onClick={() => onSelect(name)}>
                <span className="component_overview-name">{name}</span>
                <span className="component_overview-description">{summary(componentsByName[name].description)}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
};

export default ComponentOverview;
