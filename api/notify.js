export const config = {
  api: {
    bodyParser: true,
  },
};

import { Resend } from "resend";

export default async function handler(req, res) {
  try {
    console.log("BODY:", req.body);

    const { name, module, isHer } = req.body;

    if (!isHer) {
      return res.status(200).json({ message: "Skipped email (not her)" });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Game Notification <onboarding@resend.dev>",
      to: "maddhav.taneja01@gmail.com",
      subject: `She played: ${name}`,
      html: `
        <h2>She just played!</h2>
        <p><strong>${name}</strong> reached:</p>
        <p>${module}</p>
        <p>Go check the logs 👀</p>
      `
    });

    res.status(200).json({ message: "Email sent" });

  } catch (err) {
    console.error("ERROR in notify:", err);
    res.status(500).json({ error: err.message });
  }
}
