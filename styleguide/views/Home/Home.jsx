import './Home.scss';

const Home = () => (
  <div className="view-home">
    <div className="home-hero">
      <span className="home-eyebrow">Design system · React 19</span>
      <h1>Build polished interfaces<br />with less friction.</h1>
      <p className="home-tagline">
        Volta is a practical component library for consistent, accessible product experiences.
      </p>
      <div className="home-hero_actions">
        <code>import {'{ Button }'} from 'volta'</code>
        <span>92 components</span>
      </div>
    </div>

    <div className="home-grid">
      <div className="home-card">
        <span className="home-card_number">01</span>
        <h3>Broad foundation</h3>
        <p>Forms, navigation, feedback, media, data display, and layout primitives in one library.</p>
      </div>
      <div className="home-card">
        <span className="home-card_number">02</span>
        <h3>Themeable by default</h3>
        <p>Runtime accent, color-scheme, and motion controls powered by shared design tokens.</p>
      </div>
      <div className="home-card">
        <span className="home-card_number">03</span>
        <h3>Built for composition</h3>
        <p>Focused components with predictable APIs that fit naturally into product workflows.</p>
      </div>
      <div className="home-card">
        <span className="home-card_number">04</span>
        <h3>Live development</h3>
        <p>Browse real states, inspect examples, and tune the visual system without leaving the styleguide.</p>
      </div>
    </div>

    <div className="home-section">
      <div className="home-section_intro">
        <span className="home-eyebrow">Quick start</span>
        <h2>Import what you need.</h2>
        <p>The package exposes a single, stable entry point and ships styles with the component bundle.</p>
      </div>
      <code>{`// 1. Copy volta into your project
npm install ../path/to/volta

// 2. Import from the library entry point
import { Button, Card, Theme } from 'volta';

<Button variant="primary">Get Started</Button>`}</code>
    </div>
  </div>
);

export default Home;
