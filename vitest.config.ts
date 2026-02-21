/**
 * Vitest Configuration - Ultra-Fast Unit Testing
 * 
 * Features:
 * - 100x faster than Jest
 * - Native ESM support
 * - Watch mode with HMR
 * - Coverage enforcement (85% minimum)
 * - Mutation Testing ready (Stryker)
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  test: {
    // Test environment
    environment: 'jsdom',
    
    // Globals
    globals: true,
    
    // Setup files
    setupFiles: ['./src/test/setup.ts'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8', // Faster than istanbul
      reporter: ['text', 'json', 'html', 'lcov'],
      
      // Minimum thresholds (enforced)
      thresholds: {
        global: {
          lines: 85,
          functions: 85,
          branches: 85,
          statements: 85,
        },
      },
      
      // Exclude patterns
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mocks/**',
      ],
      
      // Include patterns
      include: [
        'src/**/*.ts',
        'src/**/*.tsx',
      ],
    },
    
    // Test patterns
    include: [
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
      'src/**/*.spec.ts',
      'src/**/*.spec.tsx',
    ],
    
    exclude: [
      'node_modules/',
      'dist/',
      '.next/',
      'coverage/',
    ],
    
    // Test timeout
    testTimeout: 10000,
    
    // Hook timeout
    hookTimeout: 10000,
    
    // Retry failed tests
    retry: 2,
    
    // Bail on first failure
    bail: 1,
    
    // Slow test threshold
    slowTestThreshold: 1000,
    
    // Max concurrent tests
    maxConcurrency: 20,
    
    // Isolate tests
    isolate: true,
    
    // Pool configuration
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 4,
        maxThreads: 8,
      },
    },
    
    // Reporter
    reporters: ['default', 'json'],
    outputFile: {
      json: './test-results/results.json',
    },
    
    // Mock configuration
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
    
    // Sequence
    sequence: {
      shuffle: true, // Randomize test order
      concurrent: true,
    },
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@test': path.resolve(__dirname, './src/test'),
    },
  },
});
