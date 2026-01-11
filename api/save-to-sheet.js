export const config = {
  api: {
    bodyParser: true,
  },
};

import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      privateKey,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    const body = req.body;

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

    res.status(200).json({ message: "Saved to sheet" });

  } catch (err) {
    console.error("ERROR in save-to-sheet:", err);
    res.status(500).json({ error: err.message });
  }
}
