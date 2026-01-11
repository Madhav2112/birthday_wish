// netlify/functions/save-to-sheet.js
import { google } from "googleapis";

export async function handler(event, context) {
  try {
    // Validate request body
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing request body" })
      };
    }

    const {
      timestamp,
      name,
      city,
      region,
      country,
      isp,
      deviceType,
      browser,
      screenSize,
      fingerprint
    } = JSON.parse(event.body);

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
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          timestamp,
          name,
          city,
          region,
          country,
          isp,
          deviceType,
          browser,
          screenSize,
          fingerprint
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
}