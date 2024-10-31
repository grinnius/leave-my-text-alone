// netlify/functions/logVisitor.js

exports.handler = async (event) => {
    // Extract the visitor's IP address from headers
    const visitorIp = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'];
    console.log(`Client IP: ${visitorIp}`);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Visitor logged successfully" })
    };
};
