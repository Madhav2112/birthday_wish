import { google } from "googleapis";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("SAVE_TO_SHEET_BODY:", req.body);

    // ENV CHECKS
    const {
      GOOGLE_PRIVATE_KEY_B64,
      GOOGLE_CLIENT_EMAIL,
      SHEET_ID,
    } = process.env;

    console.log("ENV_CHECK:", {
      hasKey: !!GOOGLE_PRIVATE_KEY_B64,
      hasEmail: !!GOOGLE_CLIENT_EMAIL,
      hasSheet: !!SHEET_ID,
    });

    if (!GOOGLE_PRIVATE_KEY_B64 || !GOOGLE_CLIENT_EMAIL || !SHEET_ID) {
      throw new Error("Missing Google Sheets env vars");
    }

    // Decode private key
    const privateKey = Buffer.from(
      GOOGLE_PRIVATE_KEY_B64,
      "base64"
    ).toString("utf8");

    console.log("PRIVATE_KEY_START:", privateKey.split("\n")[0]);
    console.log("PRIVATE_KEY_END:", privateKey.split("\n").slice(-1)[0]);

    const auth = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      undefined,
      privateKey,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    await auth.authorize();
    console.log("GOOGLE_AUTH_SUCCESS");

    const sheets = google.sheets({ version: "v4", auth });
    const body = req.body || {};

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
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

    console.log("SHEET_APPEND_SUCCESS");

    return res.status(200).json({ message: "Saved to sheet" });

  } catch (err) {
    console.error("SAVE_TO_SHEET_ERROR:", err.message || err);
    return res.status(500).json({ error: err.message || "Save failed" });
  }
}
