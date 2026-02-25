import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * GYS Global - Zero-Lag Protocol v1.0
 * k6 Stress Test Script
 * 
 * Simulates high-status traffic bursts to verify structural integrity.
 */

export const options = {
    stages: [
        { duration: '2m', target: 100 },  // Ramp up to 100 users
        { duration: '5m', target: 500 },  // Stay at 500 users (Sovereign Load)
        { duration: '2m', target: 1000 }, // Spike to 1000 users (Institutional Burst)
        { duration: '2m', target: 0 },    // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<150'], // 95% of requests must be under 150ms
        http_req_failed: ['rate<0.01'],    // Less than 1% failure rate
    },
};

const BASE_URL = __ENV.APP_URL || 'https://gysglobal.com';

export default function () {
    // 1. Visit Home Page (Synthesis Preview)
    const homeRes = http.get(`${BASE_URL}/`);
    check(homeRes, {
        'status is 200': (r) => r.status === 200,
        'page contains brand': (r) => r.body.includes('GYS Global'),
    });

    // 2. Simulate API Call to Synthesis Engine
    const payload = JSON.stringify({
        action: 'generate',
        prompt: 'Luxury restaurant in Casablanca',
        locale: 'ar'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const apiRes = http.post(`${BASE_URL}/api/ai/core`, payload, params);
    check(apiRes, {
        'api success': (r) => r.status === 200,
        'logic verified': (r) => JSON.parse(r.body).success === true,
    });

    sleep(1);
}
