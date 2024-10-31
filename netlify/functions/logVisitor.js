// netlify/functions/logVisitor.js
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    // Extract the visitor's IP address from headers
    const visitorIp = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'];
    const timestamp = new Date().toISOString();

    // Format the log entry
    const logEntry = `Timestamp: ${timestamp}, IP: ${visitorIp} \n`;

    // Define the path for the log file
    const logFilePath = path.join('/tmp', 'visitor-log.txt');

    // Append the log entry to the log file
    fs.appendFileSync(logFilePath, logEntry);

    const clientIp = event.headers['client-ip'];
    console.log(`Client IP: ${clientIp}`);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Visitor logged successfully" })
    };
};
