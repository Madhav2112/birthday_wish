export const config = {
  api: {
    bodyParser: true,
  },
};

import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    // Reconstruct private key safely
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");

    console.log("KEY START:", privateKey.split("\n")[0]);
    console.log("KEY END:", privateKey.split("\n").slice(-2));

    const body = req.body;
    console.log("BODY:", body);

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      privateKey,
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

    res.status(200).json({ message: "Saved to sheet" });

  } catch (err) {
    console.error("ERROR in save-to-sheet:", err);
    res.status(500).json({ error: err.message });
  }
}
