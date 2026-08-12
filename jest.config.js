module.exports = {
  testEnvironment: 'jsdom',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.test.{js,jsx}'],
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
    '^react-syntax-highlighter/dist/esm/styles/prism$': '<rootDir>/tests/__mocks__/react-syntax-highlighter-styles.js',
    '^react-syntax-highlighter/dist/esm/languages/prism/.*$': '<rootDir>/tests/__mocks__/empty.js',
    '^react-syntax-highlighter$': '<rootDir>/tests/__mocks__/react-syntax-highlighter.js'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  transformIgnorePatterns: ['/node_modules/(?!react-quill-new|lodash-es|quill|quill-delta|fast-diff|eventemitter3|parchment)']
};
