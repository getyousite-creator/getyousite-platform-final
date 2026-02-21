/**
 * Load Testing Script - k6
 * 
 * Tests system under 100,000 concurrent users
 * Validates p95 latency < 500ms
 * Validates error rate < 0.1%
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// ============================================================================
// CUSTOM METRICS
// ============================================================================

const errorRate = new Rate('errors');
const p95Latency = new Trend('p95_latency');
const p99Latency = new Trend('p99_latency');

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

export const options = {
  stages: [
    { duration: '2m', target: 1000 },   // Ramp to 1,000 users
    { duration: '5m', target: 10000 },  // Ramp to 10,000 users
    { duration: '10m', target: 50000 }, // Ramp to 50,000 users
    { duration: '15m', target: 100000 },// Ramp to 100,000 users (peak)
    { duration: '30m', target: 100000 },// Stay at peak for 30 minutes
    { duration: '10m', target: 50000 }, // Ramp down
    { duration: '5m', target: 0 },      // Stop
  ],
  
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // p95 < 500ms, p99 < 1s
    http_req_failed: ['rate<0.001'],                // Error rate < 0.1%
    errors: ['rate<0.001'],                         // Custom error rate < 0.1%
    p95_latency: ['avg<500'],                       // p95 latency < 500ms
  },
  
  // Distributed load testing
  ext: {
    loadimpact: {
      distribution: {
        'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 40 },
        'amazon:eu:frankfurt': { loadZone: 'amazon:eu:frankfurt', percent: 30 },
        'amazon:ap:tokyo': { loadZone: 'amazon:ap:tokyo', percent: 20 },
        'amazon:ap:sydney': { loadZone: 'amazon:ap:sydney', percent: 10 },
      },
    },
  },
};

// ============================================================================
// TEST DATA
// ============================================================================

const BASE_URL = __ENV.BASE_URL || 'https://getyousite.com';

const testUsers = [
  { email: 'test1@example.com', password: 'Test123!' },
  { email: 'test2@example.com', password: 'Test123!' },
  { email: 'test3@example.com', password: 'Test123!' },
];

// ============================================================================
// SCENARIOS
// ============================================================================

export const scenarios = {
  // Scenario 1: Browse sites (70% of traffic)
  browse: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: 70000 },
      { duration: '30m', target: 70000 },
      { duration: '5m', target: 0 },
    ],
    gracefulStop: '30s',
    tags: { scenario: 'browse' },
    exec: 'browseScenario',
  },
  
  // Scenario 2: Authentication (10% of traffic)
  auth: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: 10000 },
      { duration: '30m', target: 10000 },
      { duration: '5m', target: 0 },
    ],
    gracefulStop: '30s',
    tags: { scenario: 'auth' },
    exec: 'authScenario',
  },
  
  // Scenario 3: Site generation (5% of traffic)
  generate: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: 5000 },
      { duration: '30m', target: 5000 },
      { duration: '5m', target: 0 },
    ],
    gracefulStop: '30s',
    tags: { scenario: 'generate' },
    exec: 'generateScenario',
  },
  
  // Scenario 4: API calls (15% of traffic)
  api: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: 15000 },
      { duration: '30m', target: 15000 },
      { duration: '5m', target: 0 },
    ],
    gracefulStop: '30s',
    tags: { scenario: 'api' },
    exec: 'apiScenario',
  },
};

// ============================================================================
// SCENARIO: BROWSE
// ============================================================================

export function browseScenario() {
  const res = http.get(`${BASE_URL}/`);
  
  const checkResult = check(res, {
    'browse: status is 200': (r) => r.status === 200,
    'browse: latency < 500ms': (r) => r.timings.duration < 500,
  });
  
  errorRate.add(!checkResult);
  p95Latency.add(res.timings.duration);
  
  sleep(1);
}

// ============================================================================
// SCENARIO: AUTH
// ============================================================================

export function authScenario() {
  const user = testUsers[Math.floor(Math.random() * testUsers.length)];
  
  // Login
  const loginRes = http.post(`${BASE_URL}/api/v1/auth/login`, JSON.stringify({
    email: user.email,
    password: user.password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  const checkResult = check(loginRes, {
    'login: status is 200': (r) => r.status === 200,
    'login: has access token': (r) => JSON.parse(r.body).data.accessToken !== undefined,
  });
  
  errorRate.add(!checkResult);
  
  sleep(2);
}

// ============================================================================
// SCENARIO: GENERATE
// ============================================================================

export function generateScenario() {
  // Get auth token first
  const user = testUsers[0];
  const loginRes = http.post(`${BASE_URL}/api/v1/auth/login`, JSON.stringify({
    email: user.email,
    password: user.password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  const token = JSON.parse(loginRes.body).data.accessToken;
  
  // Generate site
  const generateRes = http.post(`${BASE_URL}/api/v1/sites/generate`, JSON.stringify({
    businessName: 'Test Business',
    niche: 'Restaurant',
    vision: 'Test vision',
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const checkResult = check(generateRes, {
    'generate: status is 200': (r) => r.status === 200,
    'generate: has site id': (r) => JSON.parse(r.body).data.siteId !== undefined,
  });
  
  errorRate.add(!checkResult);
  
  sleep(5);
}

// ============================================================================
// SCENARIO: API
// ============================================================================

export function apiScenario() {
  // Health check
  const healthRes = http.get(`${BASE_URL}/health`);
  
  const checkResult = check(healthRes, {
    'health: status is 200': (r) => r.status === 200,
  });
  
  errorRate.add(!checkResult);
  
  sleep(0.5);
}

// ============================================================================
// HANDLERS
// ============================================================================

export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options) {
  const { metrics } = data;
  
  return `
  ┌─────────────────────────────────────────────────────────────┐
  │                    LOAD TEST RESULTS                        │
  ├─────────────────────────────────────────────────────────────┤
  │  Total Requests: ${metrics.http_reqs.values.count.toLocaleString()}
  │  Failed Requests: ${metrics.http_req_failed.values.rate * 100}%
  │  p95 Latency: ${metrics.http_req_duration.values['p(95)']}ms
  │  p99 Latency: ${metrics.http_req_duration.values['p(99)']}ms
  │  Errors: ${metrics.errors.values.rate * 100}%
  ├─────────────────────────────────────────────────────────────┤
  │  ${metrics.http_req_failed.values.rate < 0.001 ? '✅' : '❌'} Error Rate < 0.1%
  │  ${metrics.http_req_duration.values['p(95)'] < 500 ? '✅' : '❌'} p95 Latency < 500ms
  └─────────────────────────────────────────────────────────────┘
  `;
}
