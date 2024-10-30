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

// Read the current build info from buildInfo.json
let buildInfo;

try {
  buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf-8'));
} catch (error) {
  console.log('(grinnius)---> Cannot read buildInfo.json:', error);
  buildInfo = { buildNumber: 1, timestamp: "" }; // Default values if file is missing
}

console.log('(grinnius)---> Before buildInfo: ${buildInfo}');

// Increment the build number and set a new timestamp
buildInfo.buildNumber += 1;
buildInfo.timestamp = new Date().toISOString();

console.log('(grinnius)---> After buildInfo: ${buildInfo}');

fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2), 'utf-8');
console.log(`(grinnius)---> Build #${buildNumber} - ${timestamp}`);

