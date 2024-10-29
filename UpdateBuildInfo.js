const fs = require('fs');
const path = require('path');

// File path to store the build info
const buildInfoPath = path.join(__dirname, 'buildInfo.json');

// Load the existing build number from environment variables or start with 1
const buildNumber = process.env.BUILD_NUMBER ? parseInt(process.env.BUILD_NUMBER, 10) + 1 : 1;
const timestamp = new Date().toISOString();

// Save the new build number and timestamp to a JSON file
const buildInfo = {
  buildNumber,
  timestamp,
};

fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2), 'utf-8');
console.log(`Build #${buildNumber} - ${timestamp}`);

// Update the environment variable for Netlify
fs.writeFileSync(
  path.join(__dirname, '.env'),
  `BUILD_NUMBER=${buildNumber}\n`
);
