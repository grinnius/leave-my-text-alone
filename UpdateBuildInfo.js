const fs = require('fs');
const path = require('path');

console.log(`(grinnius)---> Start UpdateBuildInfo.js`);

// File path to store the build info
const outputDir = path.join(__dirname, 'LeaveMyTextAlone');
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}
const buildInfoPath = path.join(outputDir, 'buildInfo.json');

console.log(`(grinnius)---> outputDir:${outputDir} buildInfoPath:${buildInfoPath}`);

// Load the existing build number from environment variables or start with 1
const buildNumber = process.env.BUILD_NUMBER ? parseInt(process.env.BUILD_NUMBER, 10) + 1 : 1;
const timestamp = new Date().toISOString();

// Save the new build number and timestamp to a JSON file
const buildInfo = {
  buildNumber,
  timestamp
};

fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2), 'utf-8');
console.log(`(grinnius)---> Build #${buildNumber} - ${timestamp}`);

// Update the environment variable for Netlify
fs.writeFileSync(
  path.join(outputDir, '.env'),
  `BUILD_NUMBER=${buildNumber}\n`
);

console.log(`(grinnius)---> Wrote to ${outputDir}.env Build #${buildNumber}`);



