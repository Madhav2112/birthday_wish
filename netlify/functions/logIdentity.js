// netlify/functions/logIdentity.js

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    // Example: log to Netlify function logs
    console.log("Cosmic Charades identity log:", {
      name: data.name,
      timestamp: data.timestamp,
      city: data.city,
      region: data.region,
      country: data.country,
      isp: data.isp,
      ip: data.ip,
      deviceType: data.deviceType,
      browser: data.browser,
      screenSize: data.screenSize,
      fingerprint: data.fingerprint
    });

    // You can extend this:
    // - Append to a Google Sheet via Apps Script webhook
    // - Store in a database (Supabase/Firebase)
    // - Email yourself, etc.

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    console.error("Log error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};
