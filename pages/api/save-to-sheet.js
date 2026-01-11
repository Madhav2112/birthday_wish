export const config = {
  api: {
    bodyParser: true,
  },
};

import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    // Basic environment checks
    console.log("HAS_B64:", !!process.env.GOOGLE_PRIVATE_KEY_B64);
    console.log("B64_LENGTH:", process.env.GOOGLE_PRIVATE_KEY_B64 ? process.env.GOOGLE_PRIVATE_KEY_B64.length : 0);
    console.log("HAS_CLIENT_EMAIL:", !!process.env.GOOGLE_CLIENT_EMAIL);
    console.log("HAS_SHEET_ID:", !!process.env.SHEET_ID);

    if (!process.env.GOOGLE_PRIVATE_KEY_B64) {
      throw new Error("Missing GOOGLE_PRIVATE_KEY_B64");
    }
    if (!process.env.GOOGLE_CLIENT_EMAIL) {
      throw new Error("Missing GOOGLE_CLIENT_EMAIL");
    }
    if (!process.env.SHEET_ID) {
      throw new Error("Missing SHEET_ID");
    }

    // Decode the private key from base64
    const privateKey = Buffer.from(
      process.env.GOOGLE_PRIVATE_KEY_B64,
      "base64"
    ).toString("utf8");

    // Check decoded PEM structure
    console.log("DECODE_FIRST_LINE:", privateKey.split("\n")[0]);
    console.log("DECODE_LAST_LINE:", privateKey.split("\n").slice(-2).join(" | "));

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      privateKey,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    // Test authentication
    await auth.authorize();
    console.log("AUTH_SUCCESS");

    const sheets = google.sheets({ version: "v4", auth });

    const body = req.body || {};

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          body.timestamp || new Date().toISOString(),
          body.name || "",
          body.city || "",
          body.region || "",
          body.country || "",
          body.isp || "",
          body.deviceType || "",
          body.browser || "",
          body.screenSize || "",
          body.fingerprint || ""
        ]]
      }
    });

    res.status(200).json({ message: "Saved to sheet" });

  } catch (err) {
    console.error("SAVE_TO_SHEET_ERROR:", err.message || err);
    res.status(500).json({ error: err.message || String(err) });
  }
}
