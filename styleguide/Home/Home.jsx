import './Home.scss';

const Home = () => (
  <div className="view-home">
    <div className="home-hero">
      <h1>Volta</h1>
      <p className="home-tagline">A design system for web applications.</p>
    </div>

    <div className="home-grid">
      <div className="home-card">
        <h3>41 Components</h3>
        <p>Buttons, forms, navigation, modals, media — everything you need to build consistent interfaces.</p>
      </div>
      <div className="home-card">
        <h3>Dark Mode</h3>
        <p>Every component automatically adapts to <code>prefers-color-scheme: dark</code> with no extra work.</p>
      </div>
      <div className="home-card">
        <h3>SF Pro Typography</h3>
        <p>Uses the SF Pro font stack with graceful fallbacks to system-ui and Helvetica Neue.</p>
      </div>
      <div className="home-card">
        <h3>Zero Runtime Deps</h3>
        <p>Most components are pure HTML + CSS with no framework requirement. React is only for the styleguide.</p>
      </div>
    </div>

    <div className="home-section">
      <h2>Getting Started</h2>
      <code>{`// 1. Copy volta into your project
./add_to.sh /path/to/your/project

// 2. Import the styles
import './lib/volta/styles.scss';

// 3. Use components
import Button from './lib/volta/components/Button';

<Button variant="primary">Get Started</Button>`}</code>
    </div>
  </div>
);

export default Home;
