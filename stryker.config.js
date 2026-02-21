/**
 * Stryker Mutation Testing Configuration
 * 
 * Purpose: Test the tests themselves
 * If mutation doesn't fail tests = weak tests
 * 
 * Target: 85% mutation score minimum
 */

module.exports = {
  // Package manager
  packageManager: 'npm',
  
  // Mutators to use
  mutators: [
    'arithmetic-operator',
    'array-method-call',
    'arrow-function',
    'assignment-operator',
    'boolean-literal',
    'block-statement',
    'conditional-expression',
    'equality-operator',
    'logical-operator',
    'method-expression',
    'negation-operator',
    'object-literal',
    'optional-chaining',
    'regex',
    'string-literal',
    'unary-operator',
    'update-operator',
  ],
  
  // Coverage analysis
  coverageAnalysis: 'perTest',
  
  // Thresholds
  thresholds: {
    high: 85, // Target mutation score
    low: 70,  // Minimum acceptable
  },
  
  // Reporters
  reporters: [
    'clear-text',
    'html',
    'json',
    'progress',
    'dashboard',
  ],
  
  // HTML reporter config
  htmlReporter: {
    fileName: 'mutation-report.html',
  },
  
  // JSON reporter config
  jsonReporter: {
    fileName: 'mutation-report.json',
  },
  
  // Dashboard reporter
  dashboard: {
    reportType: 'full',
  },
  
  // Test runner
  testRunner: {
    name: 'vitest',
    command: 'npm run test:unit',
    allowEmpty: false,
  },
  
  // Plugins
  plugins: [
    '@stryker-mutator/vitest-runner',
    '@stryker-mutator/typescript-checker',
  ],
  
  // Build command
  buildCommand: 'npm run build',
  
  // Clean temporary files
  cleanTempDir: true,
  
  // Ignore static files
  ignoreStatic: true,
  
  // Mutation ranges
  mutate: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/*.test.ts',
    '!src/**/*.test.tsx',
    '!src/**/*.spec.ts',
    '!src/**/*.spec.tsx',
    '!src/test/**/*',
  ],
  
  // Timeout factor
  timeoutFactor: 3,
  timeoutMS: 10000,
  
  // Max concurrent test runners
  maxConcurrentTestRunners: 4,
  
  // Symlink node modules
  symlinkNodeModules: true,
  
  // Checkers
  checkers: [
    'typescript',
  ],
  
  // Checker timeout
  checkerTimeout: 30000,
  
  // Allow console colors
  allowConsoleColors: true,
  
  // Dry run only (for testing config)
  dryRunOnly: false,
  
  // Disable type checking for speed (optional)
  disableTypeChecks: false,
};
