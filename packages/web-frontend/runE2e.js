/* eslint-disable no-console */
const { execSync } = require('child_process');

const N = 5;

const log = msg => {
  console.log(`--- ${msg.toUpperCase()} ---`);
};

let failures = 0;
for (let i = 0; i < N; i++) {
  log(`Iteration #${i}`);
  try {
    execSync('yarn cypress:run', { stdio: 'inherit' });
  } catch (error) {
    console.error(error.message);
    failures++;
  }
}

const successRate = (((N - failures) / N) * 100).toFixed(2);
log(`Success rate: ${successRate}%`);
