// netlify/functions/logVisitor.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
    // Extract the visitor's IP address from headers
    const visitorIp = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'];

    // Get visitor's geolocation information
    const location = await getLocationByIp(visitorIp);
    console.log(` IP: ${visitorIp}, Code: ${location.countryCode}, Country: ${location.country}, City: ${location.city}, isp: ${location.isp}`);

    const result = await sendLocationToGoogleForm(
        getCurrentDateTimeInRiga(),
        visitorIp,
        location.countryCode,
        location.country,
        location.city,
        location.isp);

    console.log(` Data sent to Google result: ${JSON.stringify(result)}`);


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
            return { countryCode: data.countryCode, country: data.country, city: data.city, isp: data.isp  };
        } else {
            throw new Error(`Failed to retrieve location data for IP: ${ip}`);
        }
    } catch (error) {
        console.error("Error fetching location data:", error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}

/**
 * Sends location data to Google Form
 * @param date
 * @param ipAddress
 * @param countryCode
 * @param country
 * @param city
 * @param isp
 * @returns {Promise<{success: boolean, error}|{success: boolean, message: string}>}
 */
async function sendLocationToGoogleForm(date, ipAddress, countryCode, country, city, isp) {
    const formData = {
        "entry.2096472770": date,           // Date and time
        "entry.1711231142": ipAddress,      // IP Address
        "entry.681954925": countryCode,     // Country code
        "entry.1754618772": country,        // Country name
        "entry.673471904": city,            // City
        "entry.1926044684": isp             // ISP

    };

    const formURL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLScLAnZfh4EOimnrMxczh43S0kHXi4GE5DpCI97poUgfHMu4-w/formResponse";
    const params = new URLSearchParams(formData).toString();

    try {
        const response = await fetch(`${formURL}?${params}`, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        if (!response.ok) {
            throw new Error("Failed to submit form");
        }

        return {success: true, message: "Form submitted successfully!"};
    } catch (error) {
        return {success: false, error: error.message};
    }
}

function getCurrentDateTimeInRiga() {
    const options = {
        timeZone: "Europe/Riga",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
    };

    // Format date to "dd.mm.yyyy hh:mm:ss"
    const formatter = new Intl.DateTimeFormat("en-GB", options);
    const parts = formatter.formatToParts(new Date());

    const date = `${parts.find(p => p.type === "day").value}.${parts.find(p => p.type === "month").value}.${parts.find(p => p.type === "year").value}`;
    const time = `${parts.find(p => p.type === "hour").value}:${parts.find(p => p.type === "minute").value}:${parts.find(p => p.type === "second").value}`;

    return `${date} ${time}`;
}
