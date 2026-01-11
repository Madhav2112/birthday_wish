const { google } = require("googleapis");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          body.timestamp,
          body.name,
          body.city,
          body.region,
          body.country,
          body.isp,
          body.deviceType,
          body.browser,
          body.screenSize,
          body.fingerprint
        ]]
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Saved to sheet" })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
