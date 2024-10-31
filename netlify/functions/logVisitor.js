// netlify/functions/logVisitor.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
    // Extract the visitor's IP address from headers
    const visitorIp = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'];

    // Get visitor's geolocation information
    const location = await getLocationByIp(visitorIp);
    console.log(` IP: ${visitorIp}, Code: ${location.countryCode}, Country: ${location.country}, City: ${location.city}`);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Visitor logged successfully" })
    };
};

/**
 * Get location information based on an IP address.
 * @param {string} ip - The IP address to look up.
 * @returns {Promise<{ countryCode: string, country: string, city: string}>} - A promise that resolves to an object containing city and country.
 */
async function getLocationByIp(ip) {
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        const data = await response.json();

        if (data.status === 'success') {
            // Return the structure { city, country }
            return { countryCode: data.countryCode, country: data.country, city: data.city  };
        } else {
            throw new Error(`Failed to retrieve location data for IP: ${ip}`);
        }
    } catch (error) {
        console.error("Error fetching location data:", error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}
