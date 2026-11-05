module.exports = {
  presets: [
    '@babel/preset-env',
    // The automatic runtime, like the Vite build. The classic one applies
    // `defaultProps` to function components, which React 19 no longer does, so
    // tests passed while the built app lost those defaults.
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-flow'
  ]
};
