// netlify/functions/fetchMessages.js
const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const path = require('path');


console.log("Function started");

exports.handler = async () => {
    // Configure Google Sheets API with environment variables
    const auth = new JWT({
        email: process.env.MESSAGE_READER_CLIENT_EMAIL,
        key: process.env.MESSAGE_READER_PRIVATE_KEY.replace(/\\n/g, '\n'), // Convert escaped newlines
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    try {
        // Replace with your actual spreadsheet ID and range
        const spreadsheetId = '13oYI4WbEvzf8prU1xAgRQcZbceOuL6bNPRFcYS1l90k';
        const range = 'Messages!A:D';

        // Fetch data from Google Sheets
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        // Process rows into an array of message structures
        const messages = response.data.values.map(row => ({
            delay: row[0] || "0",           // First column for "delay"
            timeToLive: row[1] || "0",      // Second column for "timeToLive"
            name: row[2] || "",             // Third column for "name"
            message:  row[3] || ""          // Forth column for "message"
        }));

        console.log(JSON.stringify(messages));

        return {
            statusCode: 200,
            body: JSON.stringify(messages),
        };
    } catch (error) {
        console.error("Error fetching data from Google Sheets:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch messages' }),
        };
    }
};
