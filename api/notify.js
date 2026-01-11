import { Resend } from "resend";

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
    console.log("NOTIFY_BODY:", req.body);
    console.log("HAS_RESEND_KEY:", !!process.env.RESEND_API_KEY);

    const { name, module, isHer } = req.body || {};

    if (!isHer) {
      console.log("NOTIFY_SKIPPED: isHer=false");
      return res.status(200).json({ message: "Skipped email" });
    }

    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Game Notification <onboarding@resend.dev>",
      to: "madhav.taneja01@gmail.com",
      subject: `She played: ${name || "Unknown"}`,
      html: `
        <h2>She just played!</h2>
        <p><strong>${name || "Unknown"}</strong> reached:</p>
        <p>${module || "Unknown module"}</p>
      `,
    });

    console.log("EMAIL_SENT_SUCCESS");

    return res.status(200).json({ message: "Email sent" });
  } catch (err) {
    console.error("NOTIFY_ERROR:", err.message || err);
    return res.status(500).json({ error: err.message || "Notify failed" });
  }
}
