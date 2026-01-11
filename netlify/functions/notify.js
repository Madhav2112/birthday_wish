// netlify/functions/notify.js
import { Resend } from 'resend';

export async function handler(event, context) {
  try {
    const { name, module, isHer } = JSON.parse(event.body);

    // Only send email if she is the one playing
    if (!isHer) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Skipped email (not her)" })
      };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Game Notification <onboarding@resend.dev>",
      to: "maddhav.taneja01@gmail.com", // <-- CHANGE THIS
      subject: `She played: ${name}`,
      html: `
        <h2>She just played!</h2>
        <p><strong>${name}</strong> reached:</p>
        <p>${module}</p>
        <p>Go check the logs 👀</p>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent" })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}