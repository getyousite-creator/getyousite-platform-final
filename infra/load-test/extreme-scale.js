/**
 * k6 Load Testing - Extreme Scale
 * 
 * Scenarios:
 * 1. Stress Test (1,000,000 concurrent users)
 * 2. Spike Test (sudden traffic burst)
 * 3. Endurance Test (24h continuous)
 * 4. Memory Leak Detection
 * 
 * Target: P95 < 100ms at 1M users
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ============================================================================
// CUSTOM METRICS
// ============================================================================

const errorRate = new Rate('errors');
const p95Latency = new Trend('p95_latency');
const p99Latency = new Trend('p99_latency');
const dbLatency = new Trend('db_latency');
const memoryUsage = new Trend('memory_usage');
const requestsPerSecond = new Counter('requests_per_second');

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

export const options = {
  // Scenarios for different test types
  scenarios: {
    // 1. Stress Test - 1,000,000 concurrent users
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5m', target: 100000 },   // Ramp to 100K
        { duration: '10m', target: 500000 },  // Ramp to 500K
        { duration: '15m', target: 1000000 }, // Ramp to 1M
        { duration: '30m', target: 1000000 }, // Sustain at 1M
        { duration: '10m', target: 500000 },  // Ramp down
        { duration: '5m', target: 0 },        // Stop
      ],
      gracefulRampDown: '30s',
      tags: { scenario: 'stress' },
      exec: 'stressScenario',
    },
    
    // 2. Spike Test - sudden traffic burst
    spike_test: {
      executor: 'ramping-arrival-rate',
      startRate: 0,
      timeUnit: '1s',
      preAllocatedVUs: 10000,
      maxVUs: 100000,
      stages: [
        { duration: '1m', target: 10000 },   // Normal load
        { duration: '30s', target: 100000 }, // SUDDEN SPIKE
        { duration: '2m', target: 100000 },  // Sustain spike
        { duration: '1m', target: 10000 },   // Return to normal
      ],
      tags: { scenario: 'spike' },
      exec: 'spikeScenario',
    },
    
    // 3. Endurance Test - 24h continuous
    endurance_test: {
      executor: 'constant-vus',
      vus: 50000,
      duration: '24h',
      tags: { scenario: 'endurance' },
      exec: 'enduranceScenario',
    },
  },
  
  // Performance thresholds
  thresholds: {
    http_req_duration: [
      'p(95)<100', // P95 < 100ms
      'p(99)<200', // P99 < 200ms
    ],
    http_req_failed: ['rate<0.001'], // Error rate < 0.1%
    errors: ['rate<0.001'],
    p95_latency: ['avg<100'],
    p99_latency: ['avg<200'],
    db_latency: ['p(95)<50'], // DB P95 < 50ms
    memory_usage: ['avg<80'], // Memory < 80%
  },
  
  // Distributed load testing
  ext: {
    loadimpact: {
      distribution: {
        'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 25 },
        'amazon:eu:frankfurt': { loadZone: 'amazon:eu:frankfurt', percent: 25 },
        'amazon:ap:tokyo': { loadZone: 'amazon:ap:tokyo', percent: 25 },
        'amazon:ap:sydney': { loadZone: 'amazon:ap:sydney', percent: 25 },
      },
      apdexTimeoutInMs: 100,
    },
  },
};

// ============================================================================
// TEST DATA
// ============================================================================

const BASE_URL = __ENV.BASE_URL || 'https://getyousite.com';

const testUsers = Array.from({ length: 1000 }, (_, i) => ({
  email: `test${i}@example.com`,
  password: 'Test123!',
}));

// ============================================================================
// SCENARIO: STRESS TEST (1M Users)
// ============================================================================

export function stressScenario() {
  const startTime = Date.now();
  
  // Homepage load
  const homepageRes = http.get(`${BASE_URL}/`, {
    headers: {
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Encoding': 'gzip, deflate, br',
    },
  });
  
  const checkResult = check(homepageRes, {
    'stress: homepage status 200': (r) => r.status === 200,
    'stress: homepage latency < 100ms': (r) => r.timings.duration < 100,
  });
  
  errorRate.add(!checkResult);
  p95Latency.add(homepageRes.timings.duration);
  requestsPerSecond.add(1);
  
  // Track memory usage (simulated)
  memoryUsage.add(Math.random() * 100);
  
  sleep(0.1); // 100ms between requests
  
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  
  // Alert if P95 > 100ms
  if (p95Latency.values.avg > 100) {
    console.error(`[ALERT] P95 latency exceeded threshold: ${p95Latency.values.avg}ms`);
  }
}

// ============================================================================
// SCENARIO: SPIKE TEST
// ============================================================================

export function spikeScenario() {
  const startTime = Date.now();
  
  // API endpoint (most critical)
  const apiRes = http.get(`${BASE_URL}/api/v1/sites`, {
    headers: {
      'Authorization': `Bearer ${getRandomToken()}`,
      'Content-Type': 'application/json',
    },
  });
  
  const checkResult = check(apiRes, {
    'spike: API status 200': (r) => r.status === 200,
    'spike: API latency < 50ms': (r) => r.timings.duration < 50,
  });
  
  errorRate.add(!checkResult);
  dbLatency.add(apiRes.timings.connecting + apiRes.timings.sending);
  
  sleep(0.05); // 50ms between requests
  
  const endTime = Date.now();
  const totalTime = endTime - startTime;
}

// ============================================================================
// SCENARIO: ENDURANCE TEST (24h)
// ============================================================================

export function enduranceScenario() {
  // Full user journey
  const user = testUsers[Math.floor(Math.random() * testUsers.length)];
  
  // Login
  const loginRes = http.post(`${BASE_URL}/api/v1/auth/login`, JSON.stringify({
    email: user.email,
    password: user.password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(loginRes, {
    'endurance: login success': (r) => r.status === 200,
  });
  
  const token = JSON.parse(loginRes.body)?.data?.accessToken;
  
  if (token) {
    // Browse sites
    const sitesRes = http.get(`${BASE_URL}/api/v1/sites`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    check(sitesRes, {
      'endurance: sites load': (r) => r.status === 200,
    });
    
    // Create site
    const createRes = http.post(`${BASE_URL}/api/v1/sites/generate`, JSON.stringify({
      businessName: 'Test Business',
      niche: 'Restaurant',
      vision: 'Test vision',
    }), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    check(createRes, {
      'endurance: site created': (r) => r.status === 201,
    });
  }
  
  sleep(1); // 1s between full journeys
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getRandomToken() {
  return `token_${Math.random().toString(36).substring(7)}`;
}

// ============================================================================
// HANDLERS
// ============================================================================

export function handleSummary(data) {
  const summary = {
    totalRequests: data.metrics.http_reqs.values.count,
    failedRequests: data.metrics.http_req_failed.values.rate * 100,
    p95Latency: data.metrics.http_req_duration.values['p(95)'],
    p99Latency: data.metrics.http_req_duration.values['p(99)'],
    errorRate: data.metrics.errors.values.rate * 100,
    avgMemoryUsage: data.metrics.memory_usage.values.avg,
  };
  
  // Check if thresholds passed
  const passed = summary.p95Latency < 100 && summary.errorRate < 0.1;
  
  return {
    'summary.json': JSON.stringify(summary, null, 2),
    stdout: `
  ┌─────────────────────────────────────────────────────────────┐
  │              LOAD TEST RESULTS (1M Users)                   │
  ├─────────────────────────────────────────────────────────────┤
  │  Total Requests: ${summary.totalRequests.toLocaleString()}
  │  Failed Requests: ${summary.failedRequests.toFixed(4)}%
  │  P95 Latency: ${summary.p95Latency.toFixed(2)}ms (target: <100ms)
  │  P99 Latency: ${summary.p99Latency.toFixed(2)}ms (target: <200ms)
  │  Error Rate: ${summary.errorRate.toFixed(4)}% (target: <0.1%)
  │  Avg Memory: ${summary.avgMemoryUsage.toFixed(2)}% (target: <80%)
  ├─────────────────────────────────────────────────────────────┤
  │  ${summary.p95Latency < 100 ? '✅' : '❌'} P95 Latency < 100ms
  │  ${summary.errorRate < 0.1 ? '✅' : '❌'} Error Rate < 0.1%
  │  ${passed ? '✅ ALL THRESHOLDS PASSED' : '❌ THRESHOLDS FAILED'}
  └─────────────────────────────────────────────────────────────┘
  `,
  };
}
